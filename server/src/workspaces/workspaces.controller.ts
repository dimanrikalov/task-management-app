import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';
import { Body, Get, Post, Controller, Headers } from '@nestjs/common';

@Controller('workspaces')
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    @Get()
    async getAllWorkspaces(): Promise<IWorkspace[]> {
        return this.workspacesService.getAll();
    }

    @Post('')
    async createWorkspace(@Body() body: CreateWorkspaceDto) {
        this.workspacesService.create(body);
    }

    @Post('/colleagues')
    async addColleague(@Body() body) {
        this.workspacesService.addColleague({
            colleagueId: body.colleagueId,
            workspaceId: body.workspaceId,
        });
    }
}
