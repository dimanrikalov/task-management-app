import { Injectable } from '@nestjs/common';
import { WorkspacesGateway } from './workspaces.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractJWTData } from 'src/utils/extractJWTData';
import { isValidJWTToken } from 'src/utils/isValidJWTToken';
import { IWorkspace } from 'src/interfaces/workspace.interface';
import { IJWTPayload } from 'src/interfaces/JWTPayload.interface';
import { ICreateWorkspace } from 'src/interfaces/createWorkspace.interface';
import { IAddWorkspaceColleagues } from 'src/interfaces/addWorkspaceColleagues.interface';

@Injectable()
export class WorkspacesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly workspacesGateway: WorkspacesGateway,
    ) {}

    async getAll(): Promise<IWorkspace[]> {
        return await this.prismaService.workspace.findMany();
    }

    async create(body: ICreateWorkspace) {
        try {
            // Verify the JWT token is valid
            if (!isValidJWTToken(body.authorizationToken)) {
                throw new Error('Invalid JWT token.');
            }

            // Decode the JWT token
            const decodedToken: IJWTPayload = extractJWTData(
                body.authorizationToken,
            );

            const isWorkspaceNameTaken =
                await this.prismaService.workspace.findFirst({
                    where: {
                        name: body.name,
                    },
                });

            if (isWorkspaceNameTaken) {
                throw new Error('Workspace name is taken!');
            }

            // Create a new workspace with the owner's ID from the token
            const workspace = await this.prismaService.workspace.create({
                data: {
                    name: body.name,
                    ownerId: decodedToken.id,
                },
            });

            //add all users different from the workspace creator to the User_Workspace relation table
            const colleagueCreationPromises = body.colleagues.map(
                async (colleagueId) => {
                    await this.prismaService.user_Workspace.create({
                        data: {
                            userId: colleagueId,
                            workspaceId: workspace.id,
                        },
                    });
                },
            );

            await Promise.all(colleagueCreationPromises);

            console.log('Emitting an event...');
            //trigger a socket event with array of all affected userIds, the client will listen and check if the id from their jwtToken matches any of the array, if yes => make a getWorkspaces request
            this.workspacesGateway.handleWorkspaceCreated({
                affectedUserIds: body.colleagues,
                message: 'New workspace created.',
            });
        } catch (err) {
            // Handle errors, such as invalid tokens or database issues
            console.error(err.message);
            return err.message;
        }
    }

    async addColleagues(body: IAddWorkspaceColleagues) {
        try {
            //Verify the JWT token is valid
            if (!isValidJWTToken(body.authorizationToken)) {
                throw new Error('Invalid JWT token!');
            }

            // Decode the JWT token
            const decodedToken: IJWTPayload = extractJWTData(
                body.authorizationToken,
            );

            //check if the workspace exists
            const workspace = await this.prismaService.workspace.findFirst({
                where: {
                    id: body.workspaceId,
                },
            });

            if (!workspace) {
                throw new Error('Invalid workspace id!');
            }

            //check if the id of the user belongs to the workspace they are adding user to
            const userHasAccessToWorkspace =
                await this.prismaService.user_Workspace.findFirst({
                    where: {
                        userId: decodedToken.id,
                        workspaceId: body.workspaceId,
                    },
                });

            //if user is neither the creator, nor does he have access to the board
            if (
                !userHasAccessToWorkspace &&
                workspace.ownerId !== decodedToken.id
            ) {
                throw new Error('You do not have access to this workspace!');
            }

            //check the array of added users if any user is already added
            const filteredColleagueIds = await Promise.all(
                body.colleagues.map(async (colleagueId) => {
                    const isUserAlreadyInWorkspace =
                        await this.prismaService.user_Workspace.findFirst({
                            where: {
                                userId: colleagueId,
                                workspaceId: body.workspaceId,
                            },
                        });

                    if (!isUserAlreadyInWorkspace) {
                        return colleagueId;
                    }
                }),
            );

            await Promise.all(
                filteredColleagueIds.map(async (colleagueId) => {
                    await this.prismaService.user_Workspace.create({
                        data: {
                            userId: colleagueId,
                            workspaceId: body.workspaceId,
                        },
                    });
                }),
            );

            //trigger a socket event with array of all affected userIds, the client will listen and check if the id from their jwtToken matches any of the array, if yes => make a getWorkspaces request
            this.workspacesGateway.handleUserAddedToWorkspace({
                message: 'You were added to a workspace.',
                affectedUserIds: filteredColleagueIds,
            });
        } catch (err: any) {
            console.log(err.message);
            return err.message;
        }
    }
}
