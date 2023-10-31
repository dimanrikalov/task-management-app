import { Length, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
    @IsNotEmpty()
    @Length(60, 60)
    token: string;
}
