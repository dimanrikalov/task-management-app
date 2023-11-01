import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { Body, Get, Post, Controller, Headers } from '@nestjs/common';
import { IWorkspace } from 'src/interfaces/workspace.interface';
import { addColleaguesDto } from './dtos/addColleagues.dto';

@Controller('workspaces')
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    @Get()
    async getAllWorkspaces(): Promise<IWorkspace[]> {
        return this.workspacesService.getAll();
    }

    @Post()
    async createWorkspace(
        @Headers() headers,
        @Body() body: CreateWorkspaceDto,
    ) {
        const authorizationToken = headers.authorization;
        this.workspacesService.create({ ...body, authorizationToken });
    }

    @Post()
    async addColleague(@Headers() headers, @Body() body: addColleaguesDto) {
        const authorizationToken = headers.authorization;
        this.workspacesService.addColleagues({
            authorizationToken,
            colleagues: body.colleagues,
            workspaceId: body.workspaceId,
        });
    }
}
