import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dtos/createColumn.dto';
import { Body, Controller, Headers, Post } from '@nestjs/common';

@Controller('columns')
export class ColumnsController {
    constructor(private readonly columnsService: ColumnsService) {}

    @Post()
    async create(@Headers() headers, @Body() body: CreateColumnDto) {
        const authorizationToken = headers.authorization;
        this.columnsService.create({ ...body, authorizationToken });
    }
}
