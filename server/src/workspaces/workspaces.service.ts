import { Injectable } from '@nestjs/common';
import { WorkspacesGateway } from './workspaces.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractJWTData } from 'src/utils/extractJWTData';
import { isValidJWTToken } from 'src/utils/isValidJWTToken';
import { IWorkspace } from 'src/interfaces/workspace.interface';
import { IJWTPayload } from 'src/interfaces/JWTPayload.interface';
import { ICreateWorkspace } from 'src/interfaces/createWorkspace.interface';

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
            //trigger a socket event that will inform every added colleague about the existence of new workspace
            this.workspacesGateway.handleWorkspaceCreated({
                colleagues: body.colleagues,
                message: 'a new workspace was created',
            });
        } catch (err) {
            // Handle errors, such as invalid tokens or database issues
            console.error(err.message);
        }
    }
}
