import { useState } from 'react';
import classNames from 'classnames';
import styles from './chat.module.css';
import { extractTokens } from '@/utils';
import { VscSend } from "react-icons/vsc";
import { Message } from '../Message/Message';
import { BackButton } from '../BackButton/BackButton';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';
import { IMessage } from '@/views/BoardView/Board.viewmodel';


interface IChatProps {
	messages: IMessage[];
	isChatOpen: boolean;
	toggleIsChatOpen(): void;
}

export const Chat = ({ messages, isChatOpen, toggleIsChatOpen }: IChatProps) => {
	const [inputValue, setInputValue] = useState('');
	const { accessToken } = extractTokens();
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
				{
					messages.map((message: any) => <Message key={message.id} content={message.content} isUser={message.writtenBy === accessToken} />)
				}

			</div>
			<form className={styles.inputContainer}>
				<IntroInput
					type="text"
					value={inputValue}
					name="message-input"

					placeholder="Write message..."
					onChange={(e) => setInputValue(e.target.value)}
				/>

				<VscSend disabled={inputValue == ''} onClick={() => { }} className={classNames(styles.sendBtn, inputValue !== '' && styles.enable)} />

			</form>
		</div>
	);
};
