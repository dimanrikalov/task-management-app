import {
    IsEmail,
    MinLength,
    IsNotEmpty,
} from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @MinLength(1)
    password: string;
}