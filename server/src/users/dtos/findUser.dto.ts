import { BaseUsersDto } from './base.dto';
import { IsArray, IsNotEmpty } from 'class-validator';
import { IsArrayOfType } from 'src/validators/IsArrayOfType';

export class FindUserDto extends BaseUsersDto {
	@IsNotEmpty()
	username: string;

	@IsArrayOfType('number')
	notIn: number[];
}
