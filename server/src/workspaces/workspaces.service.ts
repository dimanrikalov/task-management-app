import { Injectable } from '@nestjs/common';
import { WorkspacesGateway } from './workspaces.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoardsService } from 'src/boards/boards.service';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { DeleteWorkspaceDto } from './dtos/deleteWorkspace.dto';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';
import { EditWorkspaceColleagueDto } from './dtos/editWorkspaceColleague.dto';

@Injectable()
export class WorkspacesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly boardsService: BoardsService,
        private readonly workspacesGateway: WorkspacesGateway,
    ) {}

    async getAll(): Promise<IWorkspace[]> {
        return await this.prismaService.workspace.findMany();
    }

    async create(body: CreateWorkspaceDto): Promise<void> {
        // A user can have only one Personal Workspace
        if (body.name.toLowerCase() === 'personal workspace') {
            throw new Error('There can only be one workspace with this name!');
        }

        // Create a new workspace with the owner's ID from the token
        const workspace = await this.prismaService.workspace.create({
            data: {
                name: body.name,
                ownerId: body.userData.id,
            },
        });

        // Handle the case where no colleagues array is passed
        body.colleagues = body.colleagues || [];

        //if the creator somehow decides to add themself as colleague we need to remove them from the array
        if (body.colleagues.includes(body.userData.id)) {
            body.colleagues = body.colleagues.filter(
                (colleagueId) => colleagueId !== body.userData.id,
            );
        }

        //add all listed colleagues different from the workspace creator to the User_Workspace relation table
        Promise.all(
            body.colleagues.map(async (colleagueId) => {
                await this.prismaService.user_Workspace.create({
                    data: {
                        userId: colleagueId,
                        workspaceId: workspace.id,
                    },
                });
            }),
        );

        console.log('Emitting an event...');
        //trigger a socket event with array of all affected userIds, the client will listen and check if the id from their jwtToken matches any of the array, if yes => make a getWorkspaces request
        this.workspacesGateway.handleWorkspaceCreated({
            affectedUserIds: body.colleagues,
            message: 'New workspace created.',
        });
    }

    async delete(body: DeleteWorkspaceDto) {
        //check if the workspace exists and is not 'Personal Workspace'
        const workspace = await this.prismaService.workspace.findFirst({
            where: {
                id: body.workspaceId,
            },
        });
        if (!workspace) {
            throw new Error('Invalid workspace ID!');
        }

        if (workspace.name.toLowerCase() === 'personal workspace') {
            throw new Error('You cannot delete your personal workspace!');
        }

        //check if user is the workspace owner
        const isWorkspaceOwner = body.userData.id === workspace.ownerId;
        if (!isWorkspaceOwner) {
            throw new Error('Unauthorized access!');
        }

        //delete cascadingly (cannot implement before having entities from all other tables inside the workspace)
        await this.boardsService.deleteMany(workspace.id);

        //remove all users with access to the workspace
        await this.prismaService.user_Workspace.deleteMany({
            where: {
                workspaceId: workspace.id,
            },
        });

        //delete the workspace itself
        await this.prismaService.workspace.delete({
            where: {
                id: workspace.id,
            },
        });
    }

    async deleteMany(userId: number) {
        //check if user exists
        const user = await this.prismaService.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new Error('User does not exist!');
        }

        //delete everything inside owned by the user workspaces
        const workspaces = await this.prismaService.workspace.findMany({
            where: {
                ownerId: user.id,
            },
        });
        Promise.all(
            workspaces.map((workspace) => async () => {
                await this.boardsService.deleteMany(workspace.id);
            }),
        );

        await this.prismaService.workspace.deleteMany({
            where: {
                ownerId: userId,
            },
        });
    }

    async addColleague(body: EditWorkspaceColleagueDto) {
        //check if the workspace exists and is not 'Personal Workspace'
        const workspace = await this.prismaService.workspace.findFirst({
            where: {
                id: body.workspaceId,
            },
        });
        if (!workspace) {
            throw new Error('Invalid workspace ID!');
        }
        if (workspace.name.toLowerCase() === 'personal workspace') {
            throw new Error(
                'This workspace is not meant to have colleagues inside!',
            );
        }

        //check if the id of the user belongs to the workspace they are adding user to
        const userHasAccessToWorkspace =
            await this.prismaService.user_Workspace.findFirst({
                where: {
                    AND: [
                        { userId: body.userData.id },
                        { workspaceId: body.workspaceId },
                    ],
                },
            });
        //if user is neither the creator, nor does he have access to the board
        if (
            !userHasAccessToWorkspace &&
            workspace.ownerId !== body.userData.id
        ) {
            throw new Error('You do not have access to this workspace!');
        }

        // check if the added colleague is already added to the workspace or is the creator himself
        const colleagueIsAlreadyAdded =
            await this.prismaService.user_Workspace.findFirst({
                where: {
                    userId: body.colleagueId,
                    workspaceId: body.workspaceId,
                },
            });
        const colleagueIsWorkspaceOwner =
            body.colleagueId === workspace.ownerId;

        if (colleagueIsAlreadyAdded) {
            throw new Error('User is already added to workspace!');
        }
        if (colleagueIsWorkspaceOwner) {
            throw new Error(
                'You cannot add the creator of the workspace to the workspace itself!',
            );
        }

        await this.prismaService.user_Workspace.create({
            data: {
                userId: body.colleagueId,
                workspaceId: body.workspaceId,
            },
        });

        //trigger a socket event with array of all affected userIds, the client will listen and check if the id from their jwtToken matches any of the array, if yes => make a getWorkspaces request
        this.workspacesGateway.handleUserAddedToWorkspace({
            message: 'You were added to a workspace.',
            affectedUserId: body.colleagueId,
        });
    }

    async removeColleague(body: EditWorkspaceColleagueDto) {
        //check if the workspace exists
        const workspace = await this.prismaService.workspace.findFirst({
            where: {
                id: body.workspaceId,
            },
        });
        if (!workspace) {
            throw new Error('Invalid workspace ID!');
        }

        //check if the id of the user belongs to the workspace they are adding user to
        const userHasAccessToWorkspace =
            await this.prismaService.user_Workspace.findFirst({
                where: {
                    AND: [
                        { userId: body.userData.id },
                        { workspaceId: body.workspaceId },
                    ],
                },
            });
        //if user is neither the creator, nor does he have access to the board
        if (
            !userHasAccessToWorkspace &&
            workspace.ownerId !== body.userData.id
        ) {
            throw new Error('You do not have access to this workspace!');
        }

        // check if the colleague to remove is the workspace owner themself
        const colleagueIsWorkspaceOwner =
            body.colleagueId === workspace.ownerId;
        if (colleagueIsWorkspaceOwner) {
            throw new Error(
                'You cannot remove the workspace owner from their workspace!',
            );
        }

        // check if the colleague to remove even has access to the workspace
        const colleagueIsAlreadyAdded =
            await this.prismaService.user_Workspace.findFirst({
                where: {
                    userId: body.colleagueId,
                    workspaceId: body.workspaceId,
                },
            });
        if (!colleagueIsAlreadyAdded) {
            throw new Error('Colleague ID is not part of the workspace!');
        }

        await this.prismaService.user_Workspace.deleteMany({
            //only 'deleteMany' supports 'AND'
            where: {
                AND: [
                    { userId: body.colleagueId },
                    { workspaceId: body.workspaceId },
                ],
            },
        });

        //emit an event to the deleted user and in case they are viewing the workspace
    }
}
