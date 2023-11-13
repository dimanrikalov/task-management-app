import classNames from 'classnames';
import styles from './message.module.css';

interface IMessageProps {
	isUser: boolean;
}

export const Message = ({ isUser }: IMessageProps) => {
	return (
		<div className={classNames(styles.container, isUser && styles.invert)}>
			<div className={classNames(styles.message, isUser && styles.invert)}>
				<p className={classNames(styles.text, isUser && styles.invert)}>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Dolore, ut a tempora optio nihil sapiente ad reprehenderit
					sit blanditiis nulla cupiditate saepe architecto
					necessitatibus corporis recusandae, quia repudiandae
					consequatur exercitationem!
				</p>
			</div>
			<div className={classNames(styles.author, isUser && styles.invert)}>
				<img src="/imgs/profile-img.jpeg" alt="user-img" />
			</div>
		</div>
	);
};
