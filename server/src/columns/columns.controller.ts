import { Response } from 'express';
import { ColumnsService } from './columns.service';
import { MoveColumnDto } from './dtos/moveColumn.dto';
import { CreateColumnDto } from './dtos/createColumn.dto';
import { RenameColumnDto } from './dtos/renameColumn.dto';
import { DeleteColumnDto } from './dtos/deleteColumn.dto';
import { Body, Controller, Delete, Res, Post, Put } from '@nestjs/common';

@Controller('columns')
export class ColumnsController {
    constructor(private readonly columnsService: ColumnsService) {}

    @Post()
    async create(@Res() res: Response, @Body() body: CreateColumnDto) {
        try {
            const columnId = await this.columnsService.create(body);
            return res.status(200).json({
                columnId,
                message: 'New column added successfully!'
            });
        } catch (err: any) {
            console.log(err.message);
            const { statusCode, message: errorMessage } = err.response;
            return res.status(statusCode || 400).json({ errorMessage });
        }
    }

    @Put('/move')
    async move(@Res() res: Response, @Body() body: MoveColumnDto) {
        try {
            await this.columnsService.move(body);
            return res.status(200).json({
                message: 'Column moved successfully!'
            });
        } catch (err: any) {
            console.log(err.message);
            const { statusCode, message: errorMessage } = err.response;
            return res.status(statusCode || 400).json({ errorMessage });
        }
    }

    @Put('/:columnId/rename')
    async rename(@Res() res: Response, @Body() body: RenameColumnDto) {
        try {
            await this.columnsService.rename(body);
            return res.status(200).json({
                message: 'Column renamed succesfully!'
            });
        } catch (err: any) {
            console.log(err.message);
            const { statusCode, message: errorMessage } = err.response;
            return res.status(statusCode || 400).json({ errorMessage });
        }
    }

    @Delete('/:columnId')
    async delete(@Res() res: Response, @Body() body: DeleteColumnDto) {
        try {
            await this.columnsService.delete(body);
            return res.status(200).json({
                message: 'Column deleted successfully!'
            });
        } catch (err: any) {
            const { statusCode, message: errorMessage } = err.response;
            return res.status(statusCode || 400).json({ errorMessage });
        }
    }
}
