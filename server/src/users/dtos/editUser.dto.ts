import { BaseUsersDto } from './base.dto';
import {
	Length,
	IsEmail,
	Matches,
	IsString,
	MinLength,
	IsOptional
} from 'class-validator';

export class EditUserDto extends BaseUsersDto {
	@IsOptional()
	@IsEmail({}, { message: 'Invalid email format!' })
	@MinLength(3, { message: 'Email must be at least 3 characters long!' })
	email: string;

	@IsOptional()
	@IsString({ message: 'Username must be a string' })
	@Length(2, 128, {
		message: 'Username must be between 2 and 128 characters long!'
	})
	username: string;

	@IsOptional()
	@MinLength(4)
	@Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z]{1,}).{4,}$/)
	password?: string;
}
