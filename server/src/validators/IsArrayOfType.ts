import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsArrayOfTypeConstraint implements ValidatorConstraintInterface {
	validate(value: any, args: ValidationArguments) {
		if (!Array.isArray(value)) {
			return false;
		}

		const itemType = args.constraints[0]; // TypeScript type

		return value.every((item) => typeof item === itemType);
	}

	defaultMessage(args: ValidationArguments) {
		const itemType = args.constraints[0]; // TypeScript type
		return `Each item in the array must be of type ${itemType}.`;
	}
}

export function IsArrayOfType(
	itemType: string | number,
	validationOptions?: ValidationOptions
) {
	return (object: object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [itemType],
			validator: IsArrayOfTypeConstraint
		});
	};
}
