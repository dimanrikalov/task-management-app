import { IsNumber } from 'class-validator';
import { BaseWorkspaceDto } from './base.dto';

export class DeleteWorkspaceDto extends BaseWorkspaceDto {
    @IsNumber()
    workspaceId: number;
}
