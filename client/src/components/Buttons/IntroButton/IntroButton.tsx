import classNames from 'classnames';
import styles from './introButton.module.css';

interface IIntroButtonProps {
    message: string;
    onClick?(): void;
    reverse?: boolean;
    disabled?: boolean;
    backgroundColor?: string;
    disableHoverEffects?: boolean;
}

export const IntroButton = ({
    message,
    backgroundColor,
    reverse = false,
    disabled = false,
    onClick = () => {},
    disableHoverEffects = false
}: IIntroButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{ backgroundColor }}
            className={classNames(
                styles.button,
                reverse && styles.reverse,
                disabled && styles.disabled,
                disableHoverEffects && styles.disableHoverEffects
            )}
        >
            {message}
        </button>
    );
};
