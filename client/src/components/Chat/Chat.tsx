import {
	useUserContext,
	IUserContextSecure
} from '../../contexts/user.context';
import classNames from 'classnames';
import styles from './chat.module.css';
import { generateImgUrl } from '@/utils';
import { VscSend } from 'react-icons/vsc';
import { useEffect, useState } from 'react';
import { Message } from '../Message/Message';
import { useLocation } from 'react-router-dom';
import { IntroInput } from '../IntroInput/IntroInput';
import { useErrorContext } from '../../contexts/error.context';
import { TbLayoutSidebarLeftExpandFilled } from 'react-icons/tb';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { MESSAGE_ENDPOINTS, METHODS, request } from '../../utils/requester';

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
	const { showError } = useErrorContext();
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const boardId = Number(useLocation().pathname.split('/').pop());
	const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
	const [refetchMessages, setRefetchMessages] = useState<boolean>(true);
	const { data: userData, accessToken } =
		useUserContext() as IUserContextSecure;

	useEffect(() => {
		setIsLoading(true);
		const getChatMessages = async () => {
			try {
				const data = await request({
					accessToken,
					method: METHODS.GET,
					endpoint: MESSAGE_ENDPOINTS.BASE(boardId)
				});

				const messages = data.map((message: any) => {
					const profileImgPath = generateImgUrl(message.profileImgPath)
					return {
						...message,
						profileImgPath
					};
				});

				setChatMessages(messages);
			} catch (err: any) {
				console.log(err.message);
				showError(err.message);
			}
			setIsLoading(false);
		};

		if (refetchMessages) {
			getChatMessages();
			setRefetchMessages(false);
		}
	}, [refetchMessages]);

	const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputValue.trim()) return;

		try {
			await request({
				accessToken,
				method: METHODS.POST,
				endpoint: MESSAGE_ENDPOINTS.BASE(boardId),
				body: { boardId, content: inputValue.trim() },
			});

			setInputValue('');
			setRefetchMessages(true);
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	};

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
				<button
					className={classNames(
						styles.hideBtn,
						isChatOpen && styles.flip
					)}
					onClick={toggleIsChatOpen}
				>
					<TbLayoutSidebarLeftExpandFilled size={32} />
				</button>
			</div>
			<div className={styles.header}>
				<h2>Board chat</h2>
			</div>
			<div className={styles.chat}>
				{isLoading ? (
					<LoadingOverlay />
				) : (
					chatMessages.map((message: IMessage) => (
						<Message
							key={message.id}
							content={message.content}
							profileImgPath={message.profileImgPath}
							isUser={message.writtenBy === userData.id}
						/>
					))
				)}
			</div>
			<form onSubmit={sendMessage} className={styles.inputContainer}>
				<IntroInput
					type="text"
					value={inputValue}
					name="message-input"
					placeholder="Write message..."
					onChange={(e) => setInputValue(e.target.value)}
				/>

				<button
					className={classNames(
						styles.sendBtn,
						inputValue.trim() !== '' && styles.enable
					)}
				>
					<VscSend disabled={inputValue.trim() == ''} />
				</button>
			</form>
		</div>
	);
};
