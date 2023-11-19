import { Injectable } from '@nestjs/common';
import { BoardsGateway } from './boards.gateway';
import { BaseUsersDto } from 'src/users/dtos/base.dto';
import { CreateBoardDto } from './dtos/createBoard.dto';
import { DeleteBoardDto } from './dtos/deleteboard.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetBoardDetails } from './dtos/getBoardDetails.dto';
import { ColumnsService } from 'src/columns/columns.service';
import { MessagesService } from 'src/messages/messages.service';
import { EditBoardColleagueDto } from './dtos/editBoardColleague.dto';

@Injectable()
export class BoardsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly boardsGateway: BoardsGateway,
        private readonly columnsService: ColumnsService,
        private readonly messagesService: MessagesService,
    ) {}

    async getUserBoards(body: BaseUsersDto) {
        /* 
            get all boards where:
            - the user_board table has an entry with userId == body.userData.id
            - the board has workspaceId where the workspace has ownerId == body.userData.id
            - the user_workspace has an entry where the userId = body.userData.id
        */
        return await this.prismaService.board.findMany({
            where: {
                OR: [
                    {
                        // Boards related to workspaces where the user has access
                        Workspace: {
                            User_Workspace: {
                                some: {
                                    userId: body.userData.id,
                                },
                            },
                        },
                    },
                    {
                        // Boards where the user is the workspace creator
                        Workspace: {
                            ownerId: body.userData.id,
                        },
                    },
                    {
                        // Boards where the user has direct access
                        User_Board: {
                            some: {
                                userId: body.userData.id,
                            },
                        },
                    },
                ],
            },
            distinct: ['id'],
        });
    }

    async getBoardById(body: GetBoardDetails) {
        const board = body.boardData;
        const boardId = body.boardData.id;

        const messages = await this.prismaService.message.findMany({
            where: {
                boardId,
            },
        });

        const boardColumns = await this.prismaService.column.findMany({
            where: {
                boardId,
            },
        });

        const boardTasks = await this.prismaService.task.findMany({
            where: {
                columnId: {
                    in: boardColumns.map((column) => column.id),
                },
            },
        });

        const boardSteps = await this.prismaService.step.findMany({
            where: {
                taskId: {
                    in: boardTasks.map((task) => task.id),
                },
            },
        });

        const tasks = boardTasks.map((task) => {
            const steps = boardSteps.filter((step) => step.taskId === task.id);

            return { ...task, steps };
        });

        const columns = boardColumns.map((column) => {
            const columnTasks = tasks.filter(
                (task) => task.columnId === column.id,
            );

            return { ...column, tasks: columnTasks };
        });

        return {
            board: {
                ...board,
                columns,
                messages,
            },
        };
    }

    async create(body: CreateBoardDto) {
        if (
            body.colleagues &&
            body.workspaceData.name.toLowerCase().trim() ===
                'personal workspace'
        ) {
            throw new Error(
                'You cannot add colleagues to boards belonging to your Personal Workspace!',
            );
        }

        const board = await this.prismaService.board.create({
            data: {
                name: body.name,
                workspaceId: body.workspaceData.id,
            },
        });

        //create the default board columns
        await this.prismaService.column.createMany({
            data: [
                {
                    name: 'To Do',
                    position: 0,
                    boardId: board.id,
                },
                {
                    name: 'Doing',
                    position: 1,
                    boardId: board.id,
                },
                {
                    name: 'Done',
                    position: 2,
                    boardId: board.id,
                },
            ],
        });

        body.colleagues = body.colleagues || [];

        //filter out any user with access to the workspace including the workspace owner or the "Deleted User"
        const userIdsWithoutWorkspaceAccess = await Promise.all(
            body.colleagues.map(async (colleagueId) => {
                const userWithWorkspaceAccess =
                    await this.prismaService.user_Workspace.findFirst({
                        where: {
                            AND: [
                                { userId: colleagueId },
                                { workspaceId: body.workspaceData.id },
                            ],
                        },
                    });

                if (
                    !userWithWorkspaceAccess &&
                    colleagueId !== body.workspaceData.ownerId &&
                    colleagueId !== 0 // "Deleted User" ID
                ) {
                    return colleagueId;
                }
            }),
        );

        const filteredUserIdsWithoutAccess =
            userIdsWithoutWorkspaceAccess.filter((id) => id !== undefined);

        //add colleagues to board
        Promise.all(
            filteredUserIdsWithoutAccess.map(
                async (colleagueId) =>
                    await this.prismaService.user_Board.create({
                        data: {
                            userId: colleagueId,
                            boardId: board.id,
                        },
                    }),
            ),
        );

        //emit an event for created board
        this.boardsGateway.handleBoardCreated({
            affectedUserIds: body.colleagues,
            message: 'New board was created.',
        });
    }

    async delete(body: DeleteBoardDto) {
        //check if the user that deletes the board owns the workspace where the board is located
        const userIsWorkspaceOwner =
            body.userData.id === body.workspaceData.ownerId;

        if (!userIsWorkspaceOwner) {
            throw new Error('You must own the workspace to delete this board.');
        }

        //delete the relationship entries concerning the board to be deleted
        await this.prismaService.user_Board.deleteMany({
            where: {
                boardId: body.boardId,
            },
        });

        //deletes all columns, tasks and steps cascadingly
        await this.columnsService.deleteMany(body.boardId);

        //delete all chat messages
        await this.messagesService.deleteAll(body.boardId);

        //delete the board
        await this.prismaService.board.delete({
            where: {
                id: body.boardId,
            },
        });
    }

    async deleteMany(workspaceId: number) {
        const boards = await this.prismaService.board.findMany({
            where: {
                workspaceId,
            },
        });

        //delete all columns from all boards
        Promise.all(
            boards.map((board) => async () => {
                await this.columnsService.deleteMany(board.id);
            }),
        );

        //remove any user_boards relationship with the deleted boards
        Promise.all(
            boards.map((board) => async () => {
                await this.prismaService.user_Board.deleteMany({
                    where: {
                        boardId: board.id,
                    },
                });
            }),
        );

        //delete the boards themselves
        await this.prismaService.board.deleteMany({
            where: {
                workspaceId,
            },
        });
    }

    async addColleague(body: EditBoardColleagueDto) {
        if (
            body.workspaceData.name.toLowerCase().trim() ===
            'personal workspace'
        ) {
            throw new Error('You cannot add colleagues to personal boards!');
        }

        //check the user to be added (it must not be the user themself, a user with access to the workspace where the board is, or the owner)
        const colleagueIsDeletedUser = body.colleagueId === 0;

        const userIsAddingThemself = body.colleagueId === body.userData.id;

        const colleagueIsWorkspaceOwner =
            body.workspaceData.ownerId === body.colleagueId;

        const colleagueIsPartOfWorkspace =
            await this.prismaService.user_Workspace.findFirst({
                where: {
                    AND: [
                        { userId: body.colleagueId },
                        { workspaceId: body.workspaceData.id },
                    ],
                },
            });

        const colleagueIsPartOfBoard =
            await this.prismaService.user_Board.findFirst({
                where: {
                    AND: [
                        { userId: body.colleagueId },
                        { boardId: body.boardData.id },
                    ],
                },
            });

        if (colleagueIsDeletedUser) {
            throw new Error('Invalid colleague ID!');
        }

        if (
            userIsAddingThemself ||
            colleagueIsPartOfBoard ||
            colleagueIsWorkspaceOwner ||
            colleagueIsPartOfWorkspace
        ) {
            throw new Error('User already has access to the board!');
        }

        await this.prismaService.user_Board.create({
            data: {
                userId: body.colleagueId,
                boardId: body.boardData.id,
            },
        });

        //trigger a socket event
        this.boardsGateway.handleUserAddedToBoard({
            message: 'You have been added to a board.',
            affectedUserId: body.colleagueId,
        });
    }

    async removeColleague(body: EditBoardColleagueDto) {
        if (
            body.workspaceData.name.toLowerCase().trim() ===
            'personal workspace'
        ) {
            throw new Error(
                'You cannot remove colleagues from personal boards.',
            );
        }

        const colleagueIsDeletedUser = body.colleagueId === 0;

        const colleagueIsWorkspaceOwner =
            body.workspaceData.ownerId === body.colleagueId;

        const colleagueIsPartOfWorkspace =
            await this.prismaService.user_Workspace.findFirst({
                where: {
                    AND: [
                        { userId: body.colleagueId },
                        { workspaceId: body.workspaceData.id },
                    ],
                },
            });

        const colleagueIsPartOfBoard =
            await this.prismaService.user_Board.findFirst({
                where: {
                    AND: [
                        { userId: body.colleagueId },
                        { boardId: body.boardData.id },
                    ],
                },
            });

        const userIsRemovingThemself = body.colleagueId === body.userData.id;

        if (colleagueIsDeletedUser) {
            throw new Error('Invalid colleague ID!');
        }
        if (userIsRemovingThemself) {
            throw new Error('You cannot remove yourself from the board!');
        }
        if (colleagueIsWorkspaceOwner) {
            throw new Error(
                'You cannot remove the workspace owner from a board that is part of the same workspace!',
            );
        }
        if (colleagueIsPartOfWorkspace) {
            throw new Error(
                'You cannot remove a user with access to the workspace from the board!',
            );
        }
        if (!colleagueIsPartOfBoard) {
            throw new Error('User is not part of the board!');
        }

        await this.prismaService.user_Board.deleteMany({
            where: {
                AND: [
                    { userId: body.colleagueId },
                    { boardId: body.boardData.id },
                ],
            },
        });

        //trigger a socket event
        this.boardsGateway.handleUserAddedToBoard({
            message: 'You have been removed from a board.',
            affectedUserId: body.colleagueId,
        });
    }
}
