import {
	SOCKET_EVENTS,
	useSocketConnection
} from '@/contexts/socketConnection.context';
import { generateImgUrl } from '@/utils';
import { useEffect, useState } from 'react';
import { ITask } from '../components/Task/Task';
import { useLocation, useNavigate } from 'react-router-dom';
import { useErrorContext } from '../contexts/error.context';
import { IDetailedWorkspace } from '../contexts/workspace.context';
import { BOARD_ENDPOINTS, METHODS, request } from '../utils/requester';
import { IUser } from '../components/AddColleagueInput/AddColleagueInput';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';

export interface IColumn {
	id: number;
	name: string;
	tasks: ITask[];
	boardId: number;
	position: number;
}

export interface IBoardData {
	id: number;
	name: string;
	columns: IColumn[];
	boardUsers: IUser[];
	workspaceId: number;
	workspace: IDetailedWorkspace;
}

export const useFetchBoardData = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { showError } = useErrorContext();
	const { socket } = useSocketConnection();
	const boardId = Number(pathname.split('/').pop());
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);
	const [workspaceUsers, setWorkspaceUsers] = useState<IUser[]>([]);
	const [boardData, setBoardData] = useState<IBoardData | null>(null);
	const [shouldBlockRefetch, setShouldBlockRefetch] =
		useState<boolean>(false);
	const { data: userData, accessToken } =
		useUserContext() as IUserContextSecure;

	useEffect(() => {
		if (!socket) return;

		const handleBoardModified = () => {
			console.log('event received');
			setShouldRefetch(true);
		};

		//USER EVENT
		socket.on(SOCKET_EVENTS.USER_DELETED, handleBoardModified);

		//TASK EVENTS
		socket.on(SOCKET_EVENTS.TASK_MOVED, handleBoardModified);
		socket.on(SOCKET_EVENTS.TASK_CREATED, handleBoardModified);
		socket.on(SOCKET_EVENTS.TASK_DELETED, handleBoardModified);
		socket.on(SOCKET_EVENTS.TASK_MODIFIED, handleBoardModified);

		//COLUMN EVENTS
		socket.on(SOCKET_EVENTS.COLUMN_MOVED, handleBoardModified);
		socket.on(SOCKET_EVENTS.COLUMN_RENAMED, handleBoardModified);
		socket.on(SOCKET_EVENTS.COLUMN_CREATED, handleBoardModified);
		socket.on(SOCKET_EVENTS.COLUMN_DELETED, handleBoardModified);

		//BOARD EVENTS
		socket.on(SOCKET_EVENTS.BOARD_DELETED, handleBoardModified);
		socket.on(SOCKET_EVENTS.BOARD_RENAMED, handleBoardModified);
		socket.on(SOCKET_EVENTS.BOARD_COLLEAGUE_ADDED, handleBoardModified);
		socket.on(SOCKET_EVENTS.BOARD_COLLEAGUE_DELETED, handleBoardModified);

		//WORKSPACE EVENTS
		socket.on(
			SOCKET_EVENTS.WORKSPACE_COLLEAGUE_DELETED,
			handleBoardModified
		);
		socket.on(SOCKET_EVENTS.WORKSPACE_DELETED, handleBoardModified);
		socket.on(SOCKET_EVENTS.WORKSPACE_COLLEAGUE_ADDED, handleBoardModified);

		return () => {
			//USER EVENT
			socket.off(SOCKET_EVENTS.USER_DELETED, handleBoardModified);

			//TASK EVENTS
			socket.off(SOCKET_EVENTS.TASK_MOVED, handleBoardModified);
			socket.off(SOCKET_EVENTS.TASK_CREATED, handleBoardModified);
			socket.off(SOCKET_EVENTS.TASK_DELETED, handleBoardModified);
			socket.off(SOCKET_EVENTS.TASK_MODIFIED, handleBoardModified);

			//COLUMN EVENTS
			socket.off(SOCKET_EVENTS.COLUMN_MOVED, handleBoardModified);
			socket.off(SOCKET_EVENTS.COLUMN_RENAMED, handleBoardModified);
			socket.off(SOCKET_EVENTS.COLUMN_CREATED, handleBoardModified);
			socket.off(SOCKET_EVENTS.COLUMN_DELETED, handleBoardModified);

			//BOARD EVENTS
			socket.off(SOCKET_EVENTS.BOARD_DELETED, handleBoardModified);
			socket.off(SOCKET_EVENTS.BOARD_RENAMED, handleBoardModified);
			socket.off(
				SOCKET_EVENTS.BOARD_COLLEAGUE_ADDED,
				handleBoardModified
			);
			socket.off(
				SOCKET_EVENTS.BOARD_COLLEAGUE_DELETED,
				handleBoardModified
			);

			//WORKSPACE EVENTS
			socket.off(
				SOCKET_EVENTS.WORKSPACE_COLLEAGUE_DELETED,
				handleBoardModified
			);
			socket.off(SOCKET_EVENTS.WORKSPACE_DELETED, handleBoardModified);
			socket.off(
				SOCKET_EVENTS.WORKSPACE_COLLEAGUE_ADDED,
				handleBoardModified
			);
		};
	}, [socket]);

	useEffect(() => {
		if (!boardData) {
			setIsLoading(true);
			return;
		}
		setIsLoading(false);
	}, [boardData]);

	useEffect(() => {
		if (!shouldRefetch || shouldBlockRefetch) return;
		const fetchBoardData = async () => {
			try {
				const newBoardData = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: BOARD_ENDPOINTS.DETAILS(boardId)
				})) as IBoardData | { errorMessage: string };

				if ('errorMessage' in newBoardData) {
					throw new Error(
						`${newBoardData.errorMessage} 
						Check your notifications for 
						potential modifications to this board.`
					);
				}

				//add workspace owner to the users with access to the workspace, and filter out the currently logged user
				const workspaceUsers = [
					...newBoardData.workspace.workspaceUsers,
					newBoardData.workspace.workspaceOwner
				]
					.filter((user) => user.id !== userData.id)
					.map((user) => ({
						...user,
						profileImagePath: generateImgUrl(user.profileImagePath)
					}));

				/* 
					add the currently logged user as 'Me' on top of the list
					and directly give the profileImagePath as we have it loaded from the authGuard
				*/

				workspaceUsers.unshift({
					username: 'Me',
					id: userData.id,
					email: userData.email,
					profileImagePath: userData.profileImagePath
				});

				const boardUsers = newBoardData.boardUsers
					.filter((user) => {
						if (
							!workspaceUsers.some(
								(workspaceUser) => workspaceUser.id === user.id
							)
						) {
							return user;
						}
					})
					.map((user) => ({
						...user,
						profileImagePath: generateImgUrl(user.profileImagePath)
					}));

				//convert task images
				newBoardData.columns.forEach((col) => {
					col.tasks.forEach((task) => {
						if (task.attachmentImgPath) {
							task.attachmentImgPath = generateImgUrl(
								task.attachmentImgPath
							);
						}
					});
				});

				setBoardData({
					...newBoardData,
					boardUsers: [...workspaceUsers, ...boardUsers]
				});

				setWorkspaceUsers(workspaceUsers);
			} catch (err: any) {
				console.log(err.message);
				showError(err.message);
				navigate(-1);
			}
		};
		console.log('updating board...');
		fetchBoardData();
		setShouldRefetch(false);
	}, [shouldRefetch, shouldBlockRefetch, boardData]);

	const callForRefetch = () => {
		setShouldRefetch(true);
	};

	const blockRefetch = () => {
		setShouldBlockRefetch(true);
	};

	const unblockRefetch = () => {
		setShouldBlockRefetch(false);
	};

	return {
		isLoading,
		boardData,
		setBoardData,
		blockRefetch,
		unblockRefetch,
		callForRefetch,
		workspaceUsers
	};
};
