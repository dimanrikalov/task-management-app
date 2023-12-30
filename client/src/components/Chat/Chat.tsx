import classNames from 'classnames';
import styles from './chat.module.css';
import { VscSend } from "react-icons/vsc";
import { IUserData } from '@/app/userSlice';
import { useEffect, useState } from 'react';
import { Message } from '../Message/Message';
import { useLocation } from 'react-router-dom';
import { BackButton } from '../BackButton/BackButton';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { MESSAGE_ENDPOINTS, METHODS, request } from '@/utils/requester';

export interface IMessage {
	id: number;
	timestamp: Date;
	content: string;
	lastName: string;
	writtenBy: number;
	firstName: string;
	profileImgPath: string;
}

interface IChatProps {
	isChatOpen: boolean;
	toggleIsChatOpen(): void;
}

export const Chat = ({ isChatOpen, toggleIsChatOpen }: IChatProps) => {
	const dispatch = useAppDispatch();
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const boardId = Number(useLocation().pathname.split('/').pop());
	const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
	const [refetchMessages, setRefetchMessages] = useState<boolean>(true);
	const { data: userData, accessToken } = useAppSelector(
		(state) => state.user
	) as { data: IUserData; accessToken: string };

	useEffect(() => {
		setIsLoading(true);
		const getChatMessages = async () => {
			try {
				const data = await request({
					accessToken,
					method: METHODS.GET,
					endpoint: MESSAGE_ENDPOINTS.BASE(boardId),
				})

				const messages = data.map((message: any) => {
					const profileImgPath = `data:image/png;base64,${message.profileImgPath}`;
					return {
						...message,
						profileImgPath
					}
				})

				setChatMessages(messages);
			} catch (err: any) {
				console.log(err.message);
				dispatch(setErrorMessageAsync(err.message));
			}
			setIsLoading(false);
		}

		if (refetchMessages) {
			getChatMessages();
			setRefetchMessages(false);
		}
	}, [refetchMessages]);


	const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputValue) return;

		try {
			await request({
				accessToken,
				method: METHODS.POST,
				body: { boardId, content: inputValue },
				endpoint: MESSAGE_ENDPOINTS.BASE(boardId),
			})

			setInputValue('');
			setRefetchMessages(true);
		} catch (err: any) {
			console.log(err.message);
			dispatch(setErrorMessageAsync(err.message));
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
					isLoading ? <LoadingOverlay />
						: chatMessages.map((message: IMessage) =>
							<Message
								key={message.id}
								content={message.content}
								profileImgPath={message.profileImgPath}
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

				<button className={classNames(styles.sendBtn, inputValue !== '' && styles.enable)}>
					<VscSend disabled={inputValue == ''} />
				</button>
			</form>
		</div>
	);
};
