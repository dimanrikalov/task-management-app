import classNames from 'classnames';
import styles from './chat.module.css';
import { VscSend } from "react-icons/vsc";
import { useEffect, useState } from 'react';
import { Message } from '../Message/Message';
import { IOutletContext } from '@/guards/authGuard';
import { BackButton } from '../BackButton/BackButton';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';
import { useLocation, useOutletContext } from 'react-router-dom';


export interface IMessage {
	id: number;
	timestamp: Date;
	content: string;
	lastName: string;
	writtenBy: number;
	firstName: string;
	profileImg: string;
}

interface IChatProps {
	isChatOpen: boolean;
	toggleIsChatOpen(): void;
}

export const Chat = ({ isChatOpen, toggleIsChatOpen }: IChatProps) => {
	const [inputValue, setInputValue] = useState('');
	const { userData } = useOutletContext<IOutletContext>();
	const boardId = useLocation().pathname.split('/').pop();
	const { accessToken } = useOutletContext<IOutletContext>();
	const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
	const [refetchMessages, setRefetchMessages] = useState<boolean>(true);

	useEffect(() => {
		if (refetchMessages) {
			getChatMessages();
			setRefetchMessages(false);
		}
	}, [refetchMessages]);

	const getChatMessages = async () => {
		try {
			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/boards/${boardId}/messages`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',

				}
			});

			const data = await res.json();

			console.log(data);
			setChatMessages(data);
		} catch (err: any) {
			console.log(err.message);
		}
	}


	const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await fetch(`${import.meta.env.VITE_SERVER_URL}/boards/${boardId}/messages`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',

				},
				body: JSON.stringify({
					boardId: boardId,
					content: inputValue
				})
			})
			setInputValue('');
			setRefetchMessages(true);
		} catch (err: any) {
			console.log(err.message);
		}
	}

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
					chatMessages.map((message: IMessage) =>
						<Message
							key={message.id}
							content={message.content}
							isUser={message.writtenBy === userData.id}
						/>
					)
				}

			</div>
			<form
				className={styles.inputContainer}
				onSubmit={sendMessage}
			>
				<IntroInput
					type="text"
					value={inputValue}
					name="message-input"
					placeholder="Write message..."
					onChange={(e) => setInputValue(e.target.value)}
				/>

				<VscSend
					disabled={inputValue == ''}
					onClick={sendMessage}
					className={classNames(styles.sendBtn, inputValue !== '' && styles.enable)}
				/>

			</form>
		</div>
	);
};
