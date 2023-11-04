import { Injectable } from '@nestjs/common';
import { TasksGateway } from './tasks.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractJWTData } from 'src/jwt/extractJWTData';
import { isValidJWTToken } from 'src/jwt/isValidJWTToken';
import { IJWTPayload } from 'src/jwt/jwt.interfaces';
import { ICreateTask } from 'src/tasks/tasks.interfaces';

@Injectable()
export class TasksService {
    constructor(
        private readonly tasksGateway: TasksGateway,
        private readonly prismaService: PrismaService,
    ) {}

    async create(body: ICreateTask) {
        try {
            // Verify the JWT token is valid
            if (!isValidJWTToken(body.authorizationToken)) {
                throw new Error('Invalid JWT token.');
            }

            // Decode the JWT token
            const decodedToken: IJWTPayload = extractJWTData(
                body.authorizationToken,
            );

            //check if board exists
            const board = await this.prismaService.board.findFirst({
                where: {
                    id: body.boardId,
                },
            });

            if (!board) {
                throw new Error('Board does not exist!');
            }

            //check if user has access to board
            const userHasAccess = await this.prismaService.user_Board.findFirst(
                {
                    where: {
                        AND: [
                            { userId: decodedToken.id },
                            { boardId: board.id },
                        ],
                    },
                },
            );

            if (!userHasAccess) {
                throw new Error('You do not have access to this board!');
            }

            // Check if column exists
            const column = await this.prismaService.column.findFirst({
                where: {
                    id: body.columnId,
                },
            });

            if (!column) {
                throw new Error('Invalid column id!');
            }

            // Check if task name is unique in the scope of the board
            const taskNameIsTaken = await this.prismaService.task.findMany({
                where: {
                    Column: {
                        Board: {
                            id: body.boardId,
                        },
                    },
                    title: body.title,
                },
            });

            if (taskNameIsTaken) {
                throw new Error('Task name is taken!');
            }

            // Create task
            await this.prismaService.task.create({
                data: {
                    ...body,
                    columnId: column.id,
                    creatorId: decodedToken.id,
                },
            });

            // Emit event with boardId to cause everyone on the board to refetch
            this.tasksGateway.handleTaskCreated({
                message: 'New task created.',
                affectedBoardId: body.boardId,
            });
        } catch (err: any) {
            console.log(err.message);
            return err.message;
        }
    }
}
