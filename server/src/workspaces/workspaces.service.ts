import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Workspace } from '../models/workspace.model';
import { WorkspacesGateway } from './workspaces.gateway';
import { User_Workspace } from 'src/models/user_workspace';
import { IJWTPayload } from 'src/interfaces/IJWTPayload.interface';
import { ICreateWorkspace } from 'src/interfaces/ICreateWorkspace.interface';

@Injectable()
export class WorkspacesService {
    constructor(
        @InjectModel(Workspace) private workspaceModel: typeof Workspace,
        @InjectModel(User_Workspace)
        private userWorkspaceModel: typeof User_Workspace,
        private readonly workspacesGateway: WorkspacesGateway,
    ) {}

    async getAll(): Promise<Workspace[]> {
        return await this.workspaceModel.findAll();
    }

    async create(body: ICreateWorkspace) {
        try {
            // Verify the JWT token is valid
            jwt.verify(body.authorization_token, process.env.JWT_SECRET);
            // Decode the JWT token
            const decodedToken: IJWTPayload = jwt.decode(
                body.authorization_token,
            ) as IJWTPayload;

            const isWorkspaceNameTaken = await this.workspaceModel.findOne({
                where: {
                    name: body.name,
                },
            });

            if (isWorkspaceNameTaken) {
                throw new Error('Workspace name is taken!');
            }

            // Create a new workspace with the owner's ID from the token
            const workspace = await this.workspaceModel.create({
                name: body.name,
                owner_id: decodedToken.id,
            });

            //add all users different from the workspace creator to the User_Workspace relation table
            const colleagueCreationPromises = body.colleagues.map(
                async (colleagueId) => {
                    await this.userWorkspaceModel.create({
                        user_id: colleagueId,
                        workspace_id: workspace.id,
                    });
                },
            );

            await Promise.all(colleagueCreationPromises);
            console.log('Emitting an event...');
            //trigger a socket event that will inform every user about the existance of new workspace they are added to
            this.workspacesGateway.handleWorkspaceCreated({
                colleagues: body.colleagues,
                event: 'a new workspace created',
            });
        } catch (err) {
            // Handle errors, such as invalid tokens or database issues
            console.error(err.message);
        }
    }
}
