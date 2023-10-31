import { Workspace } from '../models/workspace.model';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { Body, Get, Post, Controller, Headers } from '@nestjs/common';

@Controller('workspaces')
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    @Get()
    async getAllWorkspaces(): Promise<Workspace[]> {
        return this.workspacesService.getAll();
    }

    @Post()
    async createWorkspace(
        @Body() body: CreateWorkspaceDto,
        @Headers() headers,
    ) {
        // You can now access the headers in the 'headers' variable
        const authorization_token = headers.authorization; // Example: Access the 'Authorization' header
  
        // Your logic to create a workspace goes here
        this.workspacesService.create({ ...body, authorization_token });
    }
}
