import classNames from 'classnames';
import styles from './message.module.css';

interface IMessageProps {
	content: string
	isUser: boolean;
}

export const Message = ({ content, isUser }: IMessageProps) => {
	return (
		<div className={classNames(styles.container, isUser && styles.invert)}>
			<div className={classNames(styles.message, isUser && styles.invert)}>
				<p className={classNames(styles.text, isUser && styles.invert)}>
					{content}
				</p>
			</div>
			<div className={classNames(styles.author, isUser && styles.invert)}>
				<img src="/imgs/profile-img.jpeg" alt="user-img" />
			</div>
		</div>
	);
};
