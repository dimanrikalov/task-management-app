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
import { UserEntry } from '../UserEntry/UserEntry';
import { IntroInput } from '../IntroInput/IntroInput';
import { IUser } from '../AddColleagueInput/AddColleagueInput';
import { useErrorContext } from '../../contexts/error.context';
import { TbLayoutSidebarLeftExpandFilled } from 'react-icons/tb';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { MESSAGE_ENDPOINTS, METHODS, request } from '../../utils/requester';

export interface IMessage {
	id: number;
	timestamp: Date;
	content: string;
	username: string;
	writtenBy: number;
	profileImgPath: string;
}

interface IChatProps {
	boardUsers: IUser[];
	isChatOpen: boolean;
	toggleIsChatOpen(): void;
}

export const Chat = ({ isChatOpen, toggleIsChatOpen, boardUsers }: IChatProps) => {
	const { showError } = useErrorContext();
	const { data: userData, accessToken } =
		useUserContext() as IUserContextSecure;
	const [tagsCount, setTagsCount] = useState<number>(0);
	const [inputValue, setInputValue] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [taggedUsers, setTaggedUsers] = useState<IUser[]>([]);
	const boardId = Number(useLocation().pathname.split('/').pop());
	const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
	const [refetchMessages, setRefetchMessages] = useState<boolean>(true);

	useEffect(() => {
		setTagsCount((inputValue.match(/@/g) || []).length)
	}, [inputValue]);

	useEffect(() => {
		const usernames = inputValue.split(' ')
			.map(subString => subString.trim())
			.filter(subString => subString.startsWith('@'))
			.map(match => match.slice(1));

		if (usernames.length === 0) {
			setTaggedUsers([]);
			return;
		}

		/*every time the input changes check every @ for valid username */
		const tempArr: IUser[] = [];

		usernames.forEach((username) => {
			const userFound = boardUsers.find
				(boardUser =>
					boardUser.username.
						toLowerCase() === username.toLowerCase()
				)

			if (userFound) {
				tempArr.push(userFound);
			}
		})
		setTaggedUsers(Array.from(new Set(tempArr)));

	}, [inputValue, boardUsers]);

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
				body: {
					boardId,
					content: inputValue.trim(),
					taggedUsers: taggedUsers.map(user => user.id)
				},
			});

			setInputValue('');
			setRefetchMessages(true);
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	};

	const tagUser = (user: IUser) => {
		//TO DO
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
							username={message.username}
							profileImgPath={message.profileImgPath}
							isUser={message.writtenBy === userData.id}
						/>
					))
				)}
			</div>
			<form onSubmit={sendMessage} className={styles.inputContainer}>
				{
					tagsCount > taggedUsers.length &&
					<div className={styles.dropdownWrapper}>
						<h3>Tag user</h3>
						<div className={styles.dropdown}>
							{
								boardUsers.filter
									(user =>
										!taggedUsers.map(user => user.id).includes(user.id) && user.id !== userData.id
									).length > 0
									?
									boardUsers
										.filter
										(user =>
											!taggedUsers.map(user => user.id).includes(user.id) && user.id !== userData.id
										)
										.map((match) => (
											<UserEntry
												key={match.id}
												showBtn={false}
												username={match.username}
												addHandler={() => tagUser(match)}
												profileImgPath={match.profileImagePath}
											/>
										))
									:
									<h4 className={styles.noMatches}>No unique users to tag...</h4>
							}
						</div>
					</div>
				}
				<IntroInput
					type="text"
					value={inputValue}
					name="message-input"
					placeholder="Write message..."
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<button
					className={classNames(styles.sendBtn, inputValue.trim() !== '' && styles.enable)}
				>
					<VscSend disabled={inputValue.trim() === ''} />
				</button>
			</form>
		</div>
	);
};
