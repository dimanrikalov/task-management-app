import classNames from 'classnames';
import styles from './message.module.css';

interface IMessageProps {
    content: string;
    isUser: boolean;
    profileImgPath: string;
}

export const Message = ({ content, profileImgPath, isUser }: IMessageProps) => {
    return (
        <div className={classNames(styles.container, isUser && styles.invert)}>
            <div
                className={classNames(styles.message, isUser && styles.invert)}
            >
                <p className={classNames(styles.text, isUser && styles.invert)}>
                    {content}
                </p>
            </div>
            <div className={classNames(styles.author, isUser && styles.invert)}>
                <img src={profileImgPath} alt="user-img" />
            </div>
        </div>
    );
};
