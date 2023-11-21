import styles from './introButton.module.css';

interface IIntroButtonProps {
    message: string;
    onClick?(): void;
}


export const IntroButton = ({ message, onClick = () => { } }: IIntroButtonProps) => {
    return <button className={styles.button} onClick={onClick}>
        {message}
    </button>
}