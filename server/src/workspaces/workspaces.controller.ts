import { Response } from 'express';
import { BaseWorkspaceDto } from './dtos/base.dto';
import { WorkspacesService } from './workspaces.service';
import { DeleteWorkspaceDto } from './dtos/deleteWorkspace.dto';
import { RenameWorkspaceDto } from './dtos/renameWorkspace.dto';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { GetWorkspaceDetails } from './dtos/getWorkspaceDetails.dto';
import { EditWorkspaceColleagueDto } from './dtos/editWorkspaceColleague.dto';
import { Res, Get, Body, Post, Delete, Controller, Put } from '@nestjs/common';

@Controller('workspaces')
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    @Get()
    async getUserWorkspaces(
        @Res() res: Response,
        @Body() body: BaseWorkspaceDto
    ) {
        try {
            const workspaces =
                await this.workspacesService.getUserWorkspaces(body);
            return res.status(200).json(workspaces);
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.mssage
            });
        }
    }

    @Post()
    async createWorkspace(
        @Res() res: Response,
        @Body() body: CreateWorkspaceDto
    ) {
        try {
            const workspace = await this.workspacesService.create(body);
            return res.status(200).json({
                workspaceId: workspace.id,
                message: 'Workspace successfully created!'
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message
            });
        }
    }

    @Delete('/:workspaceId')
    async deleteWorkspace(
        @Res() res: Response,
        @Body() body: DeleteWorkspaceDto
    ) {
        try {
            await this.workspacesService.delete(body);
            return res.status(200).json({
                message: 'Workspace successfully deleted!'
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message
            });
        }
    }

    @Get('/:workspaceId/details')
    async getWorkspaceById(
        @Body() body: GetWorkspaceDetails,
        @Res() res: Response
    ) {
        try {
            const data = await this.workspacesService.getWorkspaceById(body);
            return res.status(200).json(data);
        } catch (err: any) {
            return res.status(400).json({ errorMessage: err.message });
        }
    }

    @Put('/:workspaceId/rename')
    async renameWorkspace(
        @Res() res: Response,
        @Body() body: RenameWorkspaceDto
    ) {
        try {
            await this.workspacesService.rename(body);
            return res.status(200).json({
                message: 'Workspace renamed successfully!'
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message
            });
        }
    }

    @Post('/:workspaceId/colleagues')
    async addColleague(
        @Res() res: Response,
        @Body() body: EditWorkspaceColleagueDto
    ) {
        try {
            await this.workspacesService.addColleague(body);
            return res.status(200).json({
                message: 'Colleague added to workspace.'
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message
            });
        }
    }

    @Delete('/:workspaceId/colleagues')
    async removeColleague(
        @Res() res: Response,
        @Body() body: EditWorkspaceColleagueDto
    ) {
        try {
            await this.workspacesService.removeColleague(body);
            return res.status(200).json({
                message: 'Colleague removed from workspace.'
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message
            });
        }
    }
}
