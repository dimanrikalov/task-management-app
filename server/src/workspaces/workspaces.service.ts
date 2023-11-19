import { Injectable } from '@nestjs/common';
import { BaseWorkspaceDto } from './dtos/base.dto';
import { WorkspacesGateway } from './workspaces.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoardsService } from 'src/boards/boards.service';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { DeleteWorkspaceDto } from './dtos/deleteWorkspace.dto';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';
import { GetWorkspaceDetails } from './dtos/getWorkspaceDetails.dto';
import { EditWorkspaceColleagueDto } from './dtos/editWorkspaceColleague.dto';

@Injectable()
export class WorkspacesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly boardsService: BoardsService,
        private readonly workspacesGateway: WorkspacesGateway,
    ) {}

    async getUserWorkspaces(body: BaseWorkspaceDto): Promise<IWorkspace[]> {
        return await this.prismaService.workspace.findMany({
            where: {
                OR: [
                    {
                        ownerId: body.userData.id,
                    },
                    {
                        User_Workspace: {
                            some: {
                                userId: body.userData.id,
                            },
                        },
                    },
                ],
            },
        });
    }

    async getWorkspaceById(body: GetWorkspaceDetails) {
        const workspaceBoards = await this.prismaService.board.findMany({
            where: {
                workspaceId: body.workspaceData.id,
            },
        });

        return { ...body.workspaceData, boards: workspaceBoards };
    }

    async create(body: CreateWorkspaceDto): Promise<void> {
        // A user can have only one Personal Workspace
        if (body.name.toLowerCase().trim() === 'personal workspace') {
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

        //if the creator somehow decides to add themself or 'Deleted_User' (id: 0) as colleague we need to remove them from the array
        if (body.colleagues.includes(body.userData.id)) {
            body.colleagues = body.colleagues.filter(
                (colleagueId) =>
                    colleagueId !== body.userData.id && colleagueId > 0,
            );
        }

        const payload = body.colleagues.map((colleagueId) => ({
            userId: colleagueId,
            workspaceId: workspace.id,
        }));

        await this.prismaService.user_Workspace.createMany({
            data: payload,
        });

        console.log('Emitting an event...');
        //trigger a socket event with array of all affected userIds, the client will listen and check if the id from their jwtToken matches any of the array, if yes => make a getWorkspaces request
        this.workspacesGateway.handleWorkspaceCreated({
            affectedUserIds: body.colleagues,
            message: 'New workspace created.',
        });
    }

    async delete(body: DeleteWorkspaceDto) {
        //check if user is the workspace owner
        if (!body.userIsWorkspaceOwner) {
            throw new Error('Unauthorized access!');
        }

        //check if the workspace exists and is not 'Personal Workspace'
        if (
            body.workspaceData.name.toLowerCase().trim() ===
            'personal workspace'
        ) {
            throw new Error('You cannot delete your personal workspace!');
        }

        //delete cascadingly
        await this.boardsService.deleteMany(body.workspaceData.id);

        //remove all users with access to the workspace
        await this.prismaService.user_Workspace.deleteMany({
            where: {
                workspaceId: body.workspaceData.id,
            },
        });

        //delete the workspace itself
        await this.prismaService.workspace.delete({
            where: {
                id: body.workspaceData.id,
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

        //delete the workspaces themselves
        await this.prismaService.workspace.deleteMany({
            where: {
                ownerId: userId,
            },
        });
    }

    async addColleague(body: EditWorkspaceColleagueDto) {
        if (
            body.workspaceData.name.toLowerCase().trim() ===
            'personal workspace'
        ) {
            throw new Error(
                'You cannot add / remove colleagues inside this workspace!',
            );
        }

        // check if the added colleague is already added to the workspace or is the creator himself
        const colleagueIsAlreadyAdded =
            await this.prismaService.user_Workspace.findFirst({
                where: {
                    userId: body.colleagueId,
                    workspaceId: body.workspaceData.id,
                },
            });
        const colleagueIsWorkspaceOwner =
            body.colleagueId === body.workspaceData.ownerId;

        //Trying to add "Deleted User"
        if (body.colleagueId == 0) {
            throw new Error('Invalid colleague ID!');
        }
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
                workspaceId: body.workspaceData.id,
            },
        });

        //trigger a socket event with array of all affected userIds, the client will listen and check if the id from their jwtToken matches any of the array, if yes => make a getWorkspaces request
        this.workspacesGateway.handleUserAddedToWorkspace({
            message: 'You were added to a workspace.',
            affectedUserId: body.colleagueId,
        });
    }

    async removeColleague(body: EditWorkspaceColleagueDto) {
        if (
            body.workspaceData.name.toLowerCase().trim() ===
            'personal workspace'
        ) {
            throw new Error(
                'You cannot add / remove colleagues inside this workspace!',
            );
        }

        // check if the colleague to remove is the workspace owner themself
        const colleagueIsWorkspaceOwner =
            body.colleagueId === body.workspaceData.ownerId;
        if (colleagueIsWorkspaceOwner) {
            throw new Error(
                'You cannot remove the workspace owner from their workspace!',
            );
        }

        // deleteMany will not throw error in case of no matching colleagueId record
        await this.prismaService.user_Workspace.deleteMany({
            where: {
                AND: [
                    { userId: body.colleagueId },
                    { workspaceId: body.workspaceData.id },
                ],
            },
        });

        //emit an event to the deleted user and in case they are viewing the workspace
    }
}
