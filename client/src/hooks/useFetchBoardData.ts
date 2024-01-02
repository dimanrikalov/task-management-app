import { useEffect, useState } from 'react';
import { IUserData } from '@/app/userSlice';
import { useLocation } from 'react-router-dom';
import { ITask } from '@/components/Task/Task';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { IDetailedWorkspace } from '@/contexts/workspace.context';
import { BOARD_ENDPOINTS, METHODS, request } from '@/utils/requester';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

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
	const dispatch = useAppDispatch();
	const { pathname } = useLocation();
	const boardId = Number(pathname.split('/').pop());
	const { data: userData, accessToken } = useAppSelector(
		(state) => state.user
	) as { data: IUserData; accessToken: string };
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [workspaceUsers, setWorkspaceUsers] = useState<IUser[]>([]);
	const [boardData, setBoardData] = useState<IBoardData | null>(null);
	const [shouldRefresh, setShouldRefresh] = useState<boolean>(true);

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
				dispatch(setErrorMessageAsync(err.message));
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
