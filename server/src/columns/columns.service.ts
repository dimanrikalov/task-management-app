import { Injectable } from '@nestjs/common';
import { BaseColumnsDto } from './dtos/base.dto';
import { ColumnsGateway } from './columns.gateway';
import { MoveColumnDto } from './dtos/moveColumn.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColumnDto } from './dtos/createColumn.dto';
import { RenameColumnDto } from './dtos/renameColumn.dto';

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

    async delete(body: BaseColumnsDto) {
        //the deletion includes the task steps
        await this.tasksService.deleteMany(body.columnData.id);
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
        //check if the new position is valid
        const allBoardColumns = await this.prismaService.column.findMany({
            where: {
                AND: [{ boardId: body.boardData.id }],
            },
        });

        // its is not possible to have empty array as at least 3 columns will be created by default and will not be erasable
        const maxPosition = allBoardColumns
            .map((column) => column.position)
            .sort((a, b) => b - a)[0];

        if (body.newPosition < 0 || body.newPosition > maxPosition) {
            throw new Error('Invalid new position!');
        }

        // Update the column's position
        await this.prismaService.column.update({
            where: { id: body.columnId },
            data: {
                position: body.newPosition,
            },
        });

        // Update the positions of other columns if needed
        if (body.columnData.position < body.newPosition) {
            // Shift columns between the old and new positions up by 1
            await this.prismaService.column.updateMany({
                where: {
                    AND: [
                        { boardId: body.columnData.boardId },
                        {
                            position: {
                                gte: body.columnData.position,
                                lte: body.newPosition - 1,
                            },
                        },
                    ],
                },
                data: {
                    position: { increment: 1 },
                },
            });
        } else if (body.columnData.position > body.newPosition) {
            // Shift columns between the new and old positions down by 1
            await this.prismaService.column.updateMany({
                where: {
                    AND: [
                        { boardId: body.columnData.boardId },
                        {
                            position: {
                                gte: body.newPosition,
                                lte: body.columnData.position - 1,
                            },
                        },
                    ],
                },
                data: {
                    position: { increment: -1 },
                },
            });
        }
    }

    async rename(body: RenameColumnDto) {
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
