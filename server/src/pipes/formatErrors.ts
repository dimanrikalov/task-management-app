import { ValidationError } from 'class-validator';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

type IErrorMessage = Record<string, any>;

function formatErrorsHelper(errors: ValidationError[]): IErrorMessage {
	const result: IErrorMessage = {};

	for (const item of errors) {
		const { property, constraints, children } = item;

		if (constraints) {
			result[property] = Object.values(constraints)[0]; // Take the first error message
			break; // Stop iterating after the first error
		}

		if (Array.isArray(children) && children.length > 0) {
			result[property] = formatErrorsHelper(children);
			break; // Stop iterating after the first error
		}
	}
	return Object.values(result);
}

export const formatErrorPipe = new ValidationPipe({
	exceptionFactory: (errors: ValidationError[]) => {
		const formattedErrors = formatErrorsHelper(errors);
		return new BadRequestException(formattedErrors);
	}
});
