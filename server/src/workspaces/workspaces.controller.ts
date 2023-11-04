import { Response } from 'express';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';
import { Body, Get, Post, Put, Delete, Controller, Res } from '@nestjs/common';
import { EditWorkspaceColleagueDto } from './dtos/editWorkspaceColleague.dto';
import { DeleteWorkspaceDto } from './dtos/deleteWorkspace.dto';

@Controller('workspaces')
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    @Get()
    async getAllWorkspaces(): Promise<IWorkspace[]> {
        return this.workspacesService.getAll();
    }

    @Post()
    async createWorkspace(
        @Res() res: Response,
        @Body() body: CreateWorkspaceDto,
    ) {
        try {
            await this.workspacesService.create(body);
            return res.status(200).json({
                message: `${body.name} successfully created.`,
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Delete()
    async deleteWorkspace(
        @Res() res: Response,
        @Body() body: DeleteWorkspaceDto,
    ) {
        try {
            await this.workspacesService.delete(body);
            return res.status(200).json({
                message: 'Workspace successfully deleted.',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Put('/colleagues/add')
    async addColleague(
        @Res() res: Response,
        @Body() body: EditWorkspaceColleagueDto,
    ) {
        try {
            this.workspacesService.addColleague(body);
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Put('/colleagues/remove')
    async removeColleague(
        @Res() res: Response,
        @Body() body: EditWorkspaceColleagueDto,
    ) {
        try {
            this.workspacesService.removeColleague(body);
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }
}
