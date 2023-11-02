import { Injectable } from '@nestjs/common';
import { ColumnsGateway } from './columns.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractJWTData } from 'src/utils/extractJWTData';
import { isValidJWTToken } from 'src/utils/isValidJWTToken';
import { IJWTPayload } from 'src/interfaces/JWTPayload.interface';
import { ICreateColumn } from 'src/interfaces/createColumn.interface';

@Injectable()
export class ColumnsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly columnsGateway: ColumnsGateway,
    ) {}

    async create(body: ICreateColumn) {
        try {
            // Verify the JWT token is valid
            if (!isValidJWTToken(body.authorizationToken)) {
                throw new Error('Invalid JWT token.');
            }

            // Decode the JWT token
            const decodedToken: IJWTPayload = extractJWTData(
                body.authorizationToken,
            );

            const userHasAccessToBoard =
                await this.prismaService.user_Board.findFirst({
                    where: {
                        AND: [
                            { boardId: body.boardId },
                            { userId: decodedToken.id },
                        ],
                    },
                });

            // Check if user has access to the board
            if (!userHasAccessToBoard) {
                throw new Error('You do not have access to the board!');
            }

            //check if the column name is not taken in the scope of the board
            const isColumnNameTaken = await this.prismaService.column.findFirst(
                {
                    where: {
                        AND: {
                            name: body.name,
                            boardId: body.boardId,
                        },
                    },
                },
            );

            if (isColumnNameTaken) {
                throw new Error('Board name is taken!');
            }

            const allColumns = await this.prismaService.column.findMany({
                where: {
                    boardId: body.boardId,
                },
            });

            allColumns.sort((a, b) => b.position - a.position);

            //create the column
            //set column position == columns + 1
            await this.prismaService.column.create({
                data: {
                    name: body.name,
                    creatorId: 1,
                    boardId: body.boardId,
                    position: allColumns[0].position + 1,
                },
            });

            //emit event to anyone inside the board that the board view must be refreshed
            //check on the client side inside board view if the boardId === affectedBoardId, if yes trigger refetching request
            this.columnsGateway.handleColumnCreated({
                message: 'New column created',
                affectedBoardId: body.boardId,
            });
        } catch (err: any) {
            console.log(err.message);
        }
    }
}
