import { Injectable } from '@nestjs/common';
import { BoardsGateway } from './boards.gateway';
import { CreateBoardDto } from './dtos/createBoard.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IBoard } from 'src/boards/boards.interfaces';
import { EditBoardColleagueDto } from './dtos/editBoardColleague.dto';

@Injectable()
export class BoardsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly boardsGateway: BoardsGateway,
    ) {}

    async create(body: CreateBoardDto) {
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

        //filter out any user with access to the workspace including the workspace owner
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
                    colleagueId !== body.workspaceData.ownerId
                ) {
                    return colleagueId;
                }
            }),
        );

        //add colleagues to board
        await Promise.all(
            userIdsWithoutWorkspaceAccess.map(async (colleagueId) => {
                await this.prismaService.user_Board.create({
                    data: {
                        userId: colleagueId,
                        boardId: board.id,
                    },
                });
            }),
        );

        //emit an event for created board
        this.boardsGateway.handleBoardCreated({
            affectedUserIds: body.colleagues,
            message: 'New board was created.',
        });
    }

    async addColleague(body: EditBoardColleagueDto) {
        //check the user to be added (it must not be the user themself, a user with access to the workspace where the board is, or the owner)
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

        const userIsAddingThemself = body.colleagueId === body.userData.id;

        if (
            userIsAddingThemself ||
            colleagueIsPartOfBoard ||
            colleagueIsWorkspaceOwner ||
            colleagueIsPartOfWorkspace
        ) {
            throw new Error('User already has access to the workspace!');
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

        if (userIsRemovingThemself) {
            throw new Error('You cannot remove yourself from the board!');
        }
        if (colleagueIsWorkspaceOwner || colleagueIsPartOfWorkspace) {
            throw new Error(
                'You cannot remove a user with access to the workspace from the board!',
            );
        }
        if (!colleagueIsPartOfBoard) {
            throw new Error('User is not part of the board!');
        }

        //cannot use delete with 'AND'
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
