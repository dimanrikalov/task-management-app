import { Injectable } from '@nestjs/common';
import { BoardsGateway } from './boards.gateway';
import { IBoard } from 'src/interfaces/board.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractJWTData } from 'src/utils/extractJWTData';
import { isValidJWTToken } from 'src/utils/isValidJWTToken';
import { IJWTPayload } from 'src/interfaces/JWTPayload.interface';
import { ICreateBoard } from 'src/interfaces/createBoard.interface';
import { IAddBoardColleague } from 'src/interfaces/addBoardColleague.interface';

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

            if (!body.colleagues) {
                body.colleagues = [];
            }

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

                //check if user has access to workspace
                const userHasAccessToWorkspace =
                    await this.prismaService.user_Workspace.findFirst({
                        where: {
                            AND: [
                                { userId: userData.id },
                                { workspaceId: workspace.id },
                            ],
                        },
                    });

                if (
                    !userHasAccessToWorkspace &&
                    workspace.ownerId !== userData.id
                ) {
                    throw new Error('You do not have access to the workspace!');
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

                //if board is part of workspace then the boardOwner = workspaceOwner
                board = await this.prismaService.board.create({
                    data: {
                        name: body.name,
                        ownerId: workspace.ownerId,
                        workspaceId: body.workspaceId,
                    },
                });

                //if user is not workspace owner add them to the board colleague array
                if (workspace.ownerId !== userData.id) {
                    body.colleagues.push(userData.id);
                }
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

            //add colleagues to board
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

            //emit an event for created board
            this.boardsGateway.handleBoardCreated({
                affectedUserIds: body.colleagues,
                message: 'New board was created.',
            });
        } catch (err: any) {
            console.error(err.message);
            return err.message;
        }
    }

    async addColleague(body: IAddBoardColleague) {
        try {
            // Verify the JWT token is valid
            if (!isValidJWTToken(body.authorizationToken)) {
                throw new Error('Invalid JWT token!');
            }

            // Decode the JWT token
            const userData: IJWTPayload = extractJWTData(
                body.authorizationToken,
            );

            // Check if board exists
            const board = await this.prismaService.board.findFirst({
                where: {
                    id: body.boardId,
                },
            });

            if (!board) {
                throw new Error('Invalid board id.');
            }

            //if board is part of workspace
            if (board.workspaceId) {
                //get the workspace
                const workspace = await this.prismaService.workspace.findFirst({
                    where: {
                        id: board.workspaceId,
                    },
                });

                // Check if user has access to the board through the workspace or directly through the board or is workspaceOwner (boardCreator === workspaceOwner in this case)
                const userHasWorkspaceAccess =
                    await this.prismaService.user_Workspace.findFirst({
                        where: {
                            AND: [
                                { workspaceId: board.workspaceId },
                                { userId: userData.id },
                            ],
                        },
                    });

                const userHasBoardAccess =
                    await this.prismaService.user_Board.findFirst({
                        where: {
                            AND: [
                                { boardId: board.id },
                                { userId: userData.id },
                            ],
                        },
                    });

                const userIsWorkspaceCreator =
                    userData.id === workspace.ownerId;

                if (
                    !userHasWorkspaceAccess &&
                    !userHasBoardAccess &&
                    !userIsWorkspaceCreator
                ) {
                    throw new Error(
                        'You do not have permission to add colleagues to this board!',
                    );
                }
            } else {
                // Check only users with access to the board + boardCreator
                const userHasBoardAccess =
                    await this.prismaService.user_Board.findFirst({
                        where: {
                            AND: [
                                { boardId: board.id },
                                { userId: userData.id },
                            ],
                        },
                    });

                const userIsBoardOwner = userData.id === board.ownerId;

                if (!userHasBoardAccess && !userIsBoardOwner) {
                    throw new Error(
                        'You do not have permission to add colleagues to this board!',
                    );
                }
            }

            // Check if the user to be added is already part of the board
            const userIsAlreadyAdded =
                await this.prismaService.user_Board.findFirst({
                    where: {
                        userId: body.colleagueId,
                        boardId: board.id,
                    },
                });

            if (userIsAlreadyAdded) {
                throw new Error('User is already added to the board.');
            }

            //trigger a socket event
            this.boardsGateway.handleUserAddedToBoard({
                message: 'You have been added to a board.',
                affectedUserId: body.colleagueId,
            });
        } catch (err: any) {
            console.log(err.message);
            return err.message;
        }
    }
}
