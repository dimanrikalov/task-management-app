import classNames from 'classnames';
import styles from './introButton.module.css';

interface IIntroButtonProps {
    message: string;
    disabled?: boolean;
    reverse?: boolean;
    onClick?(): void;
}


export const IntroButton = ({ message, disabled = false, onClick = () => { }, reverse = false }: IIntroButtonProps) => {
    return <button disabled={disabled} className={classNames(styles.button, disabled && styles.disabled, reverse && styles.reverse)} onClick={onClick}>
        {message}
    </button>
}