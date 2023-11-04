import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsArrayOfTypeConstraint implements ValidatorConstraintInterface {
    constructor(private itemType: new () => any) {}

    validate(value: any, _args: ValidationArguments) {
        if (!Array.isArray(value)) {
            return false;
        }

        return value.every((item) => item instanceof this.itemType);
    }

    defaultMessage(_args: ValidationArguments) {
        return `Each item in the array must be of type ${this.itemType.name}.`;
    }
}

export function IsArrayofType(
    itemType: new () => any,
    validationOptions?: ValidationOptions,
) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [itemType],
            validator: IsArrayOfTypeConstraint,
        });
    };
}
