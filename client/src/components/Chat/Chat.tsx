import classNames from 'classnames';
import { Input } from '../Input/Input';
import styles from './chat.module.css';
import { Message } from '../Message/Message';
import { LuMessageSquare } from 'react-icons/lu';
import { BackButton } from '../BackButton/BackButton';

interface IChatProps {
	isChatOpen: boolean;
	toggleIsChatOpen(): void;
}

export const Chat = ({ isChatOpen, toggleIsChatOpen }: IChatProps) => {
	return (
		<div
			className={classNames(
				styles.chatContainer,
				isChatOpen && styles.isOpen
			)}
		>
			<div
				className={classNames(
					styles.hideBtn,
					isChatOpen && styles.isOpen
				)}
			>
				<BackButton onClick={toggleIsChatOpen} />
			</div>
			<div className={styles.header}>
				<h2>Board chat</h2>
			</div>
			<div className={styles.chat}>
				<Message isUser={false} />
				<Message isUser={true} />
				<Message isUser={false} />
				<Message isUser={true} />
				<Message isUser={true} />
			</div>
			<form className={styles.inputContainer}>
				<Input
					name="message-input"
					onChange={() => {}}
					placeholder="Write message..."
					type="text"
					value=""
				/>
				<button className={styles.sendBtn} onClick={() => {}}>
					<LuMessageSquare size={21} />
				</button>
			</form>
		</div>
	);
};
