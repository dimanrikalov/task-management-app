import {
    Injectable,
    NestMiddleware,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ColumnCheckMiddleware implements NestMiddleware {
    constructor(private readonly prismaService: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const columnId = Number(req.params[0]?.split('/')[0]);

            if (!req.body.columnId && !columnId) {
                throw new BadRequestException('Column ID is required!');
            }
            const column = await this.prismaService.column.findFirst({
                where: {
                    id: columnId || req.body.columnId
                }
            });
            if (!column) {
                throw new NotFoundException('Invalid column ID');
            }

            req.body.boardId = column.boardId;
            req.body.columnData = column;

            next();
        } catch (err: any) {
            console.log(err.message);
            const { statusCode, message: errorMessage } = err.response;
            return res.status(statusCode || 400).json({ errorMessage });
        }
    }
}
