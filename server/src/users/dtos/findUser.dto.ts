import { IsArray, IsNotEmpty } from 'class-validator';
import { BaseUsersDto } from './base.dto';
import { IsArrayOfType } from 'src/validators/IsArrayOfType';

export class FindUserDto extends BaseUsersDto {
    @IsNotEmpty()
    email: string;

    @IsArrayOfType('number')
    notIn: number[];
}
