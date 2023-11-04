import { Response } from 'express';
import { ColumnsService } from './columns.service';
import { MoveColumnDto } from './dtos/moveColumn.dto';
import { CreateColumnDto } from './dtos/createColumn.dto';
import { RenameColumnDto } from './dtos/renameColumn.dto';
import { Body, Controller, Delete, Res, Post, Put } from '@nestjs/common';

@Controller('columns')
export class ColumnsController {
    constructor(private readonly columnsService: ColumnsService) {}

    @Post()
    async create(@Res() res: Response, @Body() body: CreateColumnDto) {
        try {
            this.columnsService.create(body);
            return res.json({
                message: 'New column added.',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Delete()
    async delete() {
        //To Do
    }

    @Put('/move')
    async move(@Res() res: Response, @Body() body: MoveColumnDto) {
        try {
            await this.columnsService.move(body);
            return res.json({
                message: 'Column position updated.',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Put('/rename')
    async rename(@Res() res: Response, @Body() body: RenameColumnDto) {
        try {
            await this.columnsService.rename(body);
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }
}
