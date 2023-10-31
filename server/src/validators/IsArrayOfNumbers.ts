import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsArrayOfNumbersConstraint
    implements ValidatorConstraintInterface
{
    validate(value: any, _args: ValidationArguments) {
        if (!Array.isArray(value)) {
            return false;
        }

        return value.every((item) => !isNaN(Number(item)));
    }

    defaultMessage(_args: ValidationArguments) {
        return 'Each item in the array must be a number.';
    }
}

export function IsArrayOfNumbers(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsArrayOfNumbersConstraint,
        });
    };
}