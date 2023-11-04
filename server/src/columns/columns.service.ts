import { Injectable } from '@nestjs/common';
import { ColumnsGateway } from './columns.gateway';
import { MoveColumnDto } from './dtos/moveColumn.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColumnDto } from './dtos/createColumn.dto';
import { RenameColumnDto } from './dtos/renameColumn.dto';

@Injectable()
export class ColumnsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly columnsGateway: ColumnsGateway,
    ) {}

    async create(body: CreateColumnDto) {
        try {
            //check if the column name is not taken in the scope of the board
            const isColumnNameTaken = await this.prismaService.column.findFirst(
                {
                    where: {
                        AND: {
                            name: body.name,
                            boardId: body.boardData.id,
                        },
                    },
                },
            );

            if (isColumnNameTaken) {
                throw new Error('Column name is taken!');
            }

            const allColumns = await this.prismaService.column.findMany({
                where: {
                    boardId: body.boardData.id,
                },
            });

            const newColumnPosition =
                allColumns.sort((a, b) => b.position - a.position)[0].position +
                1;

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
        } catch (err: any) {
            console.log(err.message);
            return err.message;
        }
    }

    async move(body: MoveColumnDto) {
        const column = await this.prismaService.column.findUnique({
            where: { id: body.columnId },
        });

        if (!column) {
            throw new Error('Invalid column ID!');
        }

        // Update the column's position
        await this.prismaService.column.update({
            where: { id: body.columnId },
            data: {
                position: body.newPosition,
            },
        });

        // Update the positions of other columns if needed
        if (column.position < body.newPosition) {
            // Shift columns between the old and new positions up by 1
            await this.prismaService.column.updateMany({
                where: {
                    AND: [
                        { boardId: column.boardId },
                        {
                            position: {
                                gte: column.position,
                                lte: body.newPosition - 1,
                            },
                        },
                    ],
                },
                data: {
                    position: { increment: 1 },
                },
            });
        } else if (column.position > body.newPosition) {
            // Shift columns between the new and old positions down by 1
            await this.prismaService.column.updateMany({
                where: {
                    AND: [
                        { boardId: column.boardId },
                        {
                            position: {
                                gte: body.newPosition,
                                lte: column.position - 1,
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
        const column = await this.prismaService.column.findUnique({
            where: { id: body.columnId },
        });

        if (!column) {
            throw new Error('Invalid column ID!');
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
                id: column.id,
            },
            data: {
                name: body.newName,
            },
        });
    }

    async delete() {
        // To Do
    }
}
