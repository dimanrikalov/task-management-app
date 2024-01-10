import { BaseUsersDto } from './base.dto';
import { IsString, Matches, MinLength, IsOptional } from 'class-validator';

export class EditUserDto extends BaseUsersDto {
	@IsOptional()
	@IsString()
	@MinLength(2, { message: 'First name must be at least 2 characters long!' })
	firstName?: string;

	@IsOptional()
	@IsString()
	@MinLength(2, { message: 'Last name must be at least 2 characters long!' })
	lastName?: string;

	@IsOptional()
	@MinLength(4)
	@Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z]{1,}).{4,}$/)
	password?: string;
}
