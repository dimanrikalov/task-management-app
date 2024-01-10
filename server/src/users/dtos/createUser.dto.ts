import { Matches, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@Matches(/^[a-zA-Z\u00C0-\u00FF]+$/, {
		message: 'First name must contain only letters!'
	})
	@MinLength(2, { message: 'First name must be at least 2 characters long!' })
	@IsNotEmpty({ message: 'First name is required!' })
	firstName: string;

	@Matches(/^[a-zA-Z\u00C0-\u00FF]+$/, {
		message: 'Last name must contain only letters!'
	})
	@IsNotEmpty({ message: 'Last name is required!' })
	@MinLength(2, { message: 'Last name must be at least 2 characters long!' })
	lastName: string;

	@IsEmail({}, { message: 'Invalid email!' })
	@IsNotEmpty({ message: 'Email is required!' })
	email: string;

	@Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z]{1,}).{4,}$/, {
		message:
			'Password must include at least 1 capital letter and 1 non-alphabetic character.'
	})
	@MinLength(4, { message: 'Password must be at least 4 characters long!' })
	password: string;
}
