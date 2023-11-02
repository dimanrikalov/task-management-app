import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { IWorkspace } from 'src/interfaces/workspace.interface';
import { Body, Get, Post, Controller, Headers } from '@nestjs/common';
import { AddWorkspaceColleaguesDto } from './dtos/addWorkspaceColleague.dto';

@Controller('workspaces')
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    @Get()
    async getAllWorkspaces(): Promise<IWorkspace[]> {
        return this.workspacesService.getAll();
    }

    @Post('')
    async createWorkspace(
        @Headers() headers,
        @Body() body: CreateWorkspaceDto,
    ) {
        const authorizationToken = headers.authorization;
        this.workspacesService.create({ ...body, authorizationToken });
    }

    @Post('/colleagues')
    async addColleague(@Headers() headers, @Body() body: AddWorkspaceColleaguesDto) {
        const authorizationToken = headers.authorization;
        this.workspacesService.addColleagues({
            authorizationToken,
            colleagues: body.colleagues,
            workspaceId: body.workspaceId,
        });
    }
}
