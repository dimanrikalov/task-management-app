import { BaseUsersDto } from './base.dto';
import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class EditUserDto extends BaseUsersDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    firstName?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    lastName?: string;

    @IsOptional()
    @MinLength(4)
    @Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z]{1,}).{4,}$/)
    password?: string;
}
