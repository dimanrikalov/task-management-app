import { IsString } from 'class-validator';
import { BaseMessagesDto } from './base.dto';

export class CreateMessageDto extends BaseMessagesDto {
	@IsString()
	content: string;
}
