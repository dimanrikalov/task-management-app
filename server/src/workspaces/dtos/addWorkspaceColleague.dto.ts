import { ArrayNotEmpty, IsNumber } from 'class-validator';

export class AddWorkspaceColleagueDto {
    @IsNumber()
    workspaceId: number;

    @ArrayNotEmpty()
    @IsNumber()
    colleagueId: number;
}
