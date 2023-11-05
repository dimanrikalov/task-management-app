import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ColumnCheckMiddleware implements NestMiddleware {
    constructor(private readonly prismaService: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body.columnId) {
                throw new Error('Column ID is required!');
            }
            const column = await this.prismaService.column.findFirst({
                where: {
                    id: req.body.columnId,
                },
            });
            if (!column) {
                throw new Error('Invalid column ID');
            }

            next();
        } catch (err: any) {
            return res.status(401).json({ errorMessage: err.message });
        }
    }
}
