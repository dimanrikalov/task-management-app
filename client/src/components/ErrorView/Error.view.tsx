import styles from './errorView.module.css'
import { useNavigate } from 'react-router-dom';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton'

interface IErrorViewProps {
    path: string;
}

export const ErrorView = ({ path }: IErrorViewProps) => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(path);
    };
    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
                <h1 className={styles.oops}>Ooops!</h1>
                <div>
                    <h2>Something went wrong...</h2>
                    <h2>but everything is <span className={styles.ok}>OK!</span></h2>
                    <h2>Just click the button below.</h2>
                    <h2>And don't forget to check your notifications!</h2>
                </div>
                <div className={styles.btnContainer}>
                    <IntroButton
                        onClick={onClick}
                        message={'Go back to the app'}
                    />
                </div>
            </div>
            <div className={styles.rightSide}>
                <img
                    alt="sign-in-img"
                    className={styles.img}
                    src="./imgs/error-img.jpeg"
                />
            </div>
        </div>
    )
}