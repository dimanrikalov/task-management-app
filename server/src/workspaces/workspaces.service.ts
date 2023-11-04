import { Injectable } from '@nestjs/common';
import { WorkspacesGateway } from './workspaces.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';

@Injectable()
export class WorkspacesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly workspacesGateway: WorkspacesGateway,
    ) {}

    async getAll(): Promise<IWorkspace[]> {
        return await this.prismaService.workspace.findMany();
    }

    async create(body: CreateWorkspaceDto) {
        // try {
        //     const isWorkspaceNameTaken =
        //         await this.prismaService.workspace.findFirst({
        //             where: {
        //                 name: body.name,
        //             },
        //         });

        //     if (isWorkspaceNameTaken) {
        //         throw new Error('Workspace name is taken!');
        //     }

        //     // Create a new workspace with the owner's ID from the token
        //     const workspace = await this.prismaService.workspace.create({
        //         data: {
        //             name: body.name,
        //             ownerId: decodedToken.id,
        //         },
        //     });

        //     //add all users different from the workspace creator to the User_Workspace relation table
        //     const colleagueCreationPromises = body.colleagues.map(
        //         async (colleagueId) => {
        //             await this.prismaService.user_Workspace.create({
        //                 data: {
        //                     userId: colleagueId,
        //                     workspaceId: workspace.id,
        //                 },
        //             });
        //         },
        //     );

        //     await Promise.all(colleagueCreationPromises);

        //     console.log('Emitting an event...');
        //     //trigger a socket event with array of all affected userIds, the client will listen and check if the id from their jwtToken matches any of the array, if yes => make a getWorkspaces request
        //     this.workspacesGateway.handleWorkspaceCreated({
        //         affectedUserIds: body.colleagues,
        //         message: 'New workspace created.',
        //     });
        // } catch (err) {
        //     // Handle errors, such as invalid tokens or database issues
        //     console.error(err.message);
        //     return err.message;
        // }
    }

    async addColleague(body) {
        // try {
        //     //check if the workspace exists
        //     const workspace = await this.prismaService.workspace.findFirst({
        //         where: {
        //             id: body.workspaceId,
        //         },
        //     });

        //     if (!workspace) {
        //         throw new Error('Invalid workspace id!');
        //     }

        //     //check if the id of the user belongs to the workspace they are adding user to
        //     const userHasAccessToWorkspace =
        //         await this.prismaService.user_Workspace.findFirst({
        //             where: {
        //                 userId: decodedToken.id,
        //                 workspaceId: body.workspaceId,
        //             },
        //         });

        //     //if user is neither the creator, nor does he have access to the board
        //     if (
        //         !userHasAccessToWorkspace &&
        //         workspace.ownerId !== decodedToken.id
        //     ) {
        //         throw new Error('You do not have access to this workspace!');
        //     }

        //     const userIsAlreadyAdded =
        //         await this.prismaService.user_Workspace.findFirst({
        //             where: {
        //                 userId: body.colleagueId,
        //                 workspaceId: body.workspaceId,
        //             },
        //         });

        //     if (userIsAlreadyAdded) {
        //         throw new Error('User is already added to workspace!');
        //     }

        //     await this.prismaService.user_Workspace.create({
        //         data: {
        //             userId: body.colleagueId,
        //             workspaceId: body.workspaceId,
        //         },
        //     });

        //     //trigger a socket event with array of all affected userIds, the client will listen and check if the id from their jwtToken matches any of the array, if yes => make a getWorkspaces request
        //     this.workspacesGateway.handleUserAddedToWorkspace({
        //         message: 'You were added to a workspace.',
        //         affectedUserId: body.colleagueId,
        //     });
        // } catch (err: any) {
        //     console.log(err.message);
        //     return err.message;
        // }
    }
}
