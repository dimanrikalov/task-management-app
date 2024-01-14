import classNames from 'classnames';
import styles from './message.module.css';
import { useState } from 'react';

interface IMessageProps {
	content: string;
	isUser: boolean;
	username: string;
	profileImgPath: string;
}

export const Message = ({ content, profileImgPath, username, isUser }: IMessageProps) => {
	const [showUsername, setShowUsername] = useState<boolean>(false);

	const toggleShowUsername = () => {
		setShowUsername(prev => !prev);
	}

	return (
		<div
			className={classNames(styles.container, isUser && styles.invert)}>
			<div
				className={classNames(styles.message, isUser && styles.invert)}
			>

				{content.startsWith('http://') || content.startsWith('https://')
					?
					<a href={content}  target="_blank" className={classNames(styles.text, isUser && styles.invert)}>
						{content}
					</a>
					:
					<p className={classNames(styles.text, isUser && styles.invert)}>
						{content}
					</p>
				}

				<p className={classNames(
					styles.username, isUser && styles.invert,
					showUsername && styles.showUsername
				)}
				>{username}
				</p>
			</div>
			<div className={classNames(styles.userInfo, isUser && styles.invert)}>

				<div
					onMouseEnter={toggleShowUsername}
					onMouseLeave={toggleShowUsername}
					className={classNames(styles.author, isUser && styles.invert)}>
					<img src={profileImgPath} alt="user-img" />
				</div>

			</div>
		</div>
	);
};
