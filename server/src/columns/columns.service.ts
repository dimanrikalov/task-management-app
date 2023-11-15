import { Injectable } from '@nestjs/common';
import { BaseColumnsDto } from './dtos/base.dto';
import { ColumnsGateway } from './columns.gateway';
import { MoveColumnDto } from './dtos/moveColumn.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColumnDto } from './dtos/createColumn.dto';
import { RenameColumnDto } from './dtos/renameColumn.dto';
import { DeleteColumnDto } from './dtos/deleteColumn.dto';

const defaultColumnNames = ['To Do', 'Doing', 'Done'];

@Injectable()
export class ColumnsService {
    constructor(
        private readonly tasksService: TasksService,
        private readonly prismaService: PrismaService,
        private readonly columnsGateway: ColumnsGateway,
    ) {}

    async create(body: CreateColumnDto) {
        //check if the column name is not taken in the scope of the board
        const isColumnNameTaken = !!(await this.prismaService.column.findFirst({
            where: {
                AND: {
                    name: body.name,
                    boardId: body.boardData.id,
                },
            },
        }));

        if (isColumnNameTaken) {
            throw new Error('Column name is taken!');
        }

        const allColumns = await this.prismaService.column.findMany({
            where: {
                boardId: body.boardData.id,
            },
        });

        const newColumnPosition =
            allColumns.sort((a, b) => b.position - a.position)[0].position + 1;

        //create the column
        //set column position == columns + 1
        await this.prismaService.column.create({
            data: {
                name: body.name,
                boardId: body.boardData.id,
                position: newColumnPosition,
            },
        });

        //emit event to anyone inside the board that the board view must be refreshed
        //check on the client side inside board view if the boardId === affectedBoardId, if yes trigger refetching request
        this.columnsGateway.handleColumnCreated({
            message: 'New column added.',
            affectedBoardId: body.boardData.id,
        });
    }

    async delete(body: DeleteColumnDto) {
        console.log(body);
        if (defaultColumnNames.includes(body.columnData.name)) {
            throw new Error('You cannot delete the default table columns!');
        }

        //the deletion includes the task steps
        await this.tasksService.deleteMany(body.columnData.id);
        await this.prismaService.column.delete({
            where: {
                id: body.columnData.id,
            },
        });
    }

    async deleteMany(boardId: number) {
        const columns = await this.prismaService.column.findMany({
            where: {
                boardId,
            },
        });

        //deletes all tasks and steps cascadingly
        await Promise.all(
            columns.map((column) => async () => {
                await this.tasksService.deleteMany(column.id);
            }),
        );

        await this.prismaService.column.deleteMany({
            where: {
                boardId,
            },
        });
    }

    async changePosition(body: MoveColumnDto) {
        // To Do
    }

    async rename(body: RenameColumnDto) {
        if (defaultColumnNames.includes(body.columnData.name)) {
            throw new Error('You cannot rename the default table columns!');
        }

        const isColumnNameTaken = await this.prismaService.column.findFirst({
            where: {
                AND: {
                    name: body.newName,
                    boardId: body.boardData.id,
                },
            },
        });

        if (isColumnNameTaken) {
            throw new Error('Column name is taken!');
        }

        await this.prismaService.column.update({
            where: {
                id: body.columnData.id,
            },
            data: {
                name: body.newName,
            },
        });
    }
}
