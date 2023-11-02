import { Injectable } from '@nestjs/common';
import { BoardsGateway } from './boards.gateway';
import { IBoard } from 'src/interfaces/board.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractJWTData } from 'src/utils/extractJWTData';
import { isValidJWTToken } from 'src/utils/isValidJWTToken';
import { ICreateBoard } from 'src/interfaces/createBoard.interface';

@Injectable()
export class BoardsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly boardsGateway: BoardsGateway,
    ) {}

    async create(body: ICreateBoard) {
        try {
            //check if the jwt token is valid
            if (!isValidJWTToken(body.authorizationToken)) {
                throw new Error('Invalid JWT token.');
            }

            const userData = extractJWTData(body.authorizationToken);

            let board: IBoard;

            //if workspaceId is present, then the board must be created inside a workspace
            if (body.workspaceId) {
                //check if the workspace exists
                const workspace = await this.prismaService.workspace.findFirst({
                    where: {
                        id: body.workspaceId,
                    },
                });

                if (!workspace) {
                    throw new Error('Workspace not found!');
                }

                //check if board name is unique in the scope of the workspace
                const isBoardNameTaken =
                    await this.prismaService.board.findFirst({
                        where: {
                            AND: [
                                { name: body.name },
                                { workspaceId: workspace.id },
                            ],
                        },
                    });

                if (isBoardNameTaken) {
                    throw new Error('Board name taken!');
                }

                //if board is part of workspace then the workspaceOwner === boardOwner and boardCreator is added to colleagues array
                board = await this.prismaService.board.create({
                    data: {
                        name: body.name,
                        ownerId: workspace.ownerId,
                        workspaceId: body.workspaceId,
                    },
                });

                body.colleagues.push(userData.id);
            } else {
                board = await this.prismaService.board.create({
                    data: {
                        name: body.name,
                        ownerId: userData.id,
                    },
                });
            }

            //create the default board tables
            await this.prismaService.column.createMany({
                data: [
                    {
                        name: 'To Do',
                        position: 0,
                        boardId: board.id,
                        creatorId: userData.id,
                    },
                    {
                        name: 'Doing',
                        position: 1,
                        boardId: board.id,
                        creatorId: userData.id,
                    },
                    {
                        name: 'Done',
                        position: 2,
                        boardId: board.id,
                        creatorId: userData.id,
                    },
                ],
            });

            //add collageues to board
            if (body.colleagues.length > 0) {
                const colleagueCreationPromises = body.colleagues.map(
                    async (colleagueId) => {
                        await this.prismaService.user_Board.create({
                            data: {
                                userId: colleagueId,
                                boardId: board.id,
                            },
                        });
                    },
                );
                await Promise.all(colleagueCreationPromises);
            }

            //emit an event for created board
            this.boardsGateway.handleBoardCreated({
                affectedUserIds: body.colleagues,
                message: 'New board was created.',
            });
        } catch (err: any) {
            console.error(err.message);
        }
    }
}
