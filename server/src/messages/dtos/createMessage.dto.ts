import { IsString } from 'class-validator';
import { BaseMessagesDto } from './base.dto';
import { IsArrayOfType } from 'src/validators/IsArrayOfType';

export class CreateMessageDto extends BaseMessagesDto {
	@IsString()
	content: string;

	@IsArrayOfType('number')
	taggedUsers: number[];
}
