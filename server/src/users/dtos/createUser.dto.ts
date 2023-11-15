import {
    Matches,
    IsEmail,
    IsAlpha,
    MinLength,
    IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsAlpha()
    @MinLength(2)
    firstName: string;

    @IsAlpha()
    @MinLength(2)
    lastName: string;

    @MinLength(4)
    @Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z]{1,}).{4,}$/)
    password: string;
}
