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
    first_name: string;

    @IsAlpha()
    @MinLength(2)
    last_name: string;

    @MinLength(4)
    @Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z]{1,}).{4,}$/)
    password: string;
}
