import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ITask } from '../components/Task/Task';
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
	const { pathname } = useLocation();
	const { showError } = useErrorContext();
	const boardId = Number(pathname.split('/').pop());
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [shouldRefresh, setShouldRefresh] = useState<boolean>(true);
	const [workspaceUsers, setWorkspaceUsers] = useState<IUser[]>([]);
	const [boardData, setBoardData] = useState<IBoardData | null>(null);
	const { data: userData, accessToken } =
		useUserContext() as IUserContextSecure;

	useEffect(() => {
		const fetchBoardData = async () => {
			try {
				setIsLoading(true);
				const newBoardData = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: BOARD_ENDPOINTS.DETAILS(boardId),
				})) as IBoardData;

				//add workspace owner to the users with access to the workspace, and filter out the currently logged user
				const workspaceUsers = [
					...newBoardData.workspace.workspaceUsers,
					newBoardData.workspace.workspaceOwner,
				]
					.filter((user) => user.id !== userData.id)
					.map((user) => ({
						...user,
						profileImagePath: `data:image/png;base64,${user.profileImagePath}`,
					}));

				/* 
					add the currently logged user as 'Me' on top of the list
					and directly give the profileImagePath as we have it loaded from the authGuard
				*/

				workspaceUsers.unshift({
					email: 'Me',
					id: userData.id,
					profileImagePath: userData.profileImagePath,
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
						profileImagePath: `data:image/png;base64,${user.profileImagePath}`,
					}));

				setBoardData({
					...newBoardData,
					boardUsers: [...workspaceUsers, ...boardUsers],
				});

				setWorkspaceUsers(workspaceUsers);
				setShouldRefresh(false);
			} catch (err: any) {
				console.log(err.message);
				showError(err.message);
			}
			setIsLoading(false);
		};

		if (!shouldRefresh) return;
		fetchBoardData();
	}, [shouldRefresh]);

	const callForRefresh = () => {
		setShouldRefresh(true);
	};

	return {
		isLoading,
		boardData,
		setBoardData,
		workspaceUsers,
		callForRefresh,
	};
};
