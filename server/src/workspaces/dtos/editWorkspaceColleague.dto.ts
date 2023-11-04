import { IsNumber } from 'class-validator';
import { BaseWorkspaceDto } from './base.dto';

export class EditWorkspaceColleagueDto extends BaseWorkspaceDto {
    @IsNumber()
    workspaceId: number;

    @IsNumber()
    colleagueId: number;
}
