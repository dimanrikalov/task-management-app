import classNames from 'classnames';
import styles from './introButton.module.css';

interface IIntroButtonProps {
    message: string;
    disabled?: boolean;
    onClick?(): void;
}


export const IntroButton = ({ message, disabled = false, onClick = () => { } }: IIntroButtonProps) => {
    return <button disabled={disabled} className={classNames(styles.button, disabled && styles.disabled)} onClick={onClick}>
        {message}
    </button>
}