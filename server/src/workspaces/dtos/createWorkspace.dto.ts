import { BaseWorkspaceDto } from './base.dto';
import { IsArrayOfType } from 'src/validators/IsArrayOfType';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateWorkspaceDto extends BaseWorkspaceDto {
	@Length(4, 128, {
		message: 'Workspace name must be at least 4 characters long!'
	})
	@IsNotEmpty({ message: 'A workspace name is required!' })
	name: string;

	@IsOptional()
	@IsArrayOfType('number')
	colleagues: number[];
}
