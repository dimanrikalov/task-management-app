import {
	Length,
	Matches,
	IsEmail,
	IsString,
	MinLength,
	MaxLength,
	IsNotEmpty
} from 'class-validator';

export class CreateUserDto {
	@IsString({ message: 'Username must be a string!' })
	@IsNotEmpty({ message: 'Username is required!' })
	@Length(2, 128, { message: 'Username must be at least 2 characters long!' })
	username: string;

	@IsEmail({}, { message: 'Invalid email!' })
	@IsNotEmpty({ message: 'Email is required!' })
	@MinLength(3, { message: 'Email must be at least 3 characters long!' })
	email: string;

	@Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z]{1,}).{4,}$/, {
		message:
			'Password must include at least 1 capital letter and 1 non-alphabetic character.'
	})
	@MinLength(4, { message: 'Password must be at least 4 characters long!' })
	@MaxLength(64, { message: 'Password must be at most 64 characters long!' })
	password: string;
}
