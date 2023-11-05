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
            await this.columnsService.create(body);
            return res.status(200).json({
                message: 'New column added successfully.',
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
        //cannot delete any of the default created columns
        //To Do
    }

    @Put('/move')
    async changePosition(@Res() res: Response, @Body() body: MoveColumnDto) {
        try {
            await this.columnsService.changePosition(body);
            return res.status(200).json({
                message: 'Column position updated successfully.',
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
            return res.status(200).json({
                message: 'Column renamed succesfully.',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }
}
