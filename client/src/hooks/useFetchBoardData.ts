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
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);
	const [workspaceUsers, setWorkspaceUsers] = useState<IUser[]>([]);
	const [boardData, setBoardData] = useState<IBoardData | null>(null);
	const { data: userData, accessToken } =
		useUserContext() as IUserContextSecure;

	useEffect(() => {
		if (!socket) return;

		const handleBoardModified = () => {
			console.log('updating board');
			setShouldRefetch(true);
		};

		/*
		listen for 
			task created / deleted / modified / moved 
			column created / deleted / modified / moved

		*/
		socket.on(
			SOCKET_EVENTS.WORKSPACE_COLLEAGUE_DELETED,
			handleBoardModified
		);
		socket.on(SOCKET_EVENTS.BOARD_DELETED, handleBoardModified);
		
		//NOT A GOOD IDEA
		// socket.on(SOCKET_EVENTS.BOARD_RENAMED, handleBoardModified);
		socket.on(SOCKET_EVENTS.BOARD_COLLEAGUE_ADDED, handleBoardModified);
		socket.on(SOCKET_EVENTS.BOARD_COLLEAGUE_DELETED, handleBoardModified);
		// socket.on(SOCKET_EVENTS.WORKSPACE_DELETED, handleBoardModified);
		// socket.on(SOCKET_EVENTS.WORKSPACE_COLLEAGUE_ADDED, handleBoardModified);

		return () => {
			//NOT A GOOD IDEA
			socket.off(
				SOCKET_EVENTS.BOARD_COLLEAGUE_ADDED,
				handleBoardModified
			);
			socket.off(
				SOCKET_EVENTS.BOARD_COLLEAGUE_DELETED,
				handleBoardModified
			);
			// socket.off(
			// 	SOCKET_EVENTS.WORKSPACE_COLLEAGUE_ADDED,
			// 	handleBoardModified
			// );
			// socket.off(
			// 	SOCKET_EVENTS.WORKSPACE_COLLEAGUE_DELETED,
			// 	handleBoardModified
			// );
			// socket.off(SOCKET_EVENTS.BOARD_RENAMED, handleBoardModified);
			socket.off(SOCKET_EVENTS.BOARD_DELETED, handleBoardModified);
			socket.off(SOCKET_EVENTS.WORKSPACE_DELETED, handleBoardModified);
		};
	}, [socket]);

	useEffect(() => {
		if (!shouldRefetch) return;
		const fetchBoardData = async () => {
			try {
				setIsLoading(true);
				const newBoardData = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: BOARD_ENDPOINTS.DETAILS(boardId)
				})) as IBoardData | { errorMessage: string };

				if ('errorMessage' in newBoardData) {
					throw new Error(
						`${newBoardData.errorMessage}. 
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
			setIsLoading(false);
		};

		fetchBoardData();
		setShouldRefetch(false);
	}, [shouldRefetch]);

	return {
		isLoading,
		boardData,
		setBoardData,
		workspaceUsers
	};
};
