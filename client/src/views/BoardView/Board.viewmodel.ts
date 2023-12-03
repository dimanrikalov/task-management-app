import { useEffect, useState } from 'react';
import { ITaskProps } from '@/components/Task/Task';
import { IOutletContext } from '@/guards/authGuard';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { EDIT_COLLEAGUE_METHOD } from '../WorkspaceView/Workspace.viewmodel';
import { IDetailedWorkspace } from '../CreateBoardView/CreateBoard.viewmodel';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

interface IColumn {
	id: number;
	name: string;
	position: number;
	boardId: number;
	tasks: ITaskProps[];
}

interface IBoardData {
	id: number;
	name: string;
	workspaceId: number;
	columns: IColumn[];
	boardUsers: IUser[];
}

interface IBoardViewModelState {
	userData: IUser;
	isChatOpen: boolean;
	workspaceUsers: IUser[];
	boardData: IBoardData | null;
	isCreateTaskModalOpen: boolean;
	isDeleteBoardModalOpen: boolean;
	isEditBoardUsersModalOpen: boolean;
}

interface IBoardViewModelOperations {
	goBack(): void;
	deleteBoard(): void;
	toggleIsChatOpen(): void;
	toggleIsCreateTaskModalOpen(): void;
	toggleIsDeleteBoardModalOpen(): void;
	toggleIsEditBoardUsersModalOpen(): void;
	addWorkspaceColleague(colleague: IUser): void;
	removeWorkspaceColleague(colleague: IUser): void;
}

export const useBoardViewModel = (): ViewModelReturnType<
	IBoardViewModelState,
	IBoardViewModelOperations
> => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const boardId = pathname.split('/').pop();
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [refreshBoard, setRefreshBoard] = useState<boolean>(true);
	const [workspaceUsers, setWorkspaceUsers] = useState<IUser[]>([]);
	const [boardData, setBoardData] = useState<IBoardData | null>(null);
	const { accessToken, userData } = useOutletContext<IOutletContext>();
	const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
	const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
	const [isEditBoardUsersModalOpen, setIsEditBoardUsersModalOpen] =
		useState(false);

	// useEffect(() => {
	// 	// console.log('workapceUsers', workspaceUsers);
	// 	console.log('boardUsers', boardData?.boardUsers);
	// 	console.log(workspaceUsers.map((user) => user.id));
	// }, [workspaceUsers, boardData]);

	useEffect(() => {
		const fetchBoardData = async () => {
			try {
				//fetch board
				const boardRes = await fetch(
					`${
						import.meta.env.VITE_SERVER_URL
					}/boards/${boardId}/details`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${accessToken}`,
						},
						credentials: 'include', // Include credentials (cookies) in the request
					}
				);
				const boardData = (await boardRes.json()) as IBoardData;

				//fetch board's workspace
				const workpsaceRes = await fetch(
					`${import.meta.env.VITE_SERVER_URL}/workspaces/${
						boardData.workspaceId
					}/details`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				const workspaceData =
					(await workpsaceRes.json()) as IDetailedWorkspace;

				const workspaceUsers = [
					...workspaceData.workspaceUsers,
					{
						email: 'Me',
						id: userData.id,
						profileImagePath: userData.profileImagePath,
					},
				];

				if (
					!workspaceUsers.some(
						(x) => workspaceData.workspaceOwner.id === x.id
					)
				) {
					workspaceUsers.push(workspaceData.workspaceOwner);
				}

				const boardUsers = boardData.boardUsers.filter(
					(boardUser) =>
						!workspaceUsers.some(
							(workspaceUser) => workspaceUser.id === boardUser.id
						)
				);

				//set data
				setWorkspaceUsers(workspaceUsers);
				setBoardData({
					...boardData,
					boardUsers,
				});
				setRefreshBoard(false);
				return;
			} catch (err: any) {
				console.log(err.message);
			}
		};

		if (!refreshBoard) return;
		fetchBoardData();
	}, [refreshBoard]);

	const goBack = () => {
		navigate(-1);
	};

	const toggleIsChatOpen = () => {
		setIsChatOpen((prev) => !prev);
	};

	const toggleIsCreateTaskModalOpen = () => {
		setIsCreateTaskModalOpen((prev) => !prev);
	};

	const toggleIsDeleteBoardModalOpen = () => {
		setIsDeleteBoardModalOpen((prev) => !prev);
	};

	const toggleIsEditBoardUsersModalOpen = () => {
		setIsEditBoardUsersModalOpen((prev) => !prev);
	};

	const editBoardColleague = async (
		colleague: IUser,
		method: EDIT_COLLEAGUE_METHOD
	) => {
		if (!boardData) {
			console.log('No board data!');
			return;
		}

		try {
			await fetch(
				`${import.meta.env.VITE_SERVER_URL}/boards/${
					boardData.id
				}/colleagues`,
				{
					method,
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						colleagueId: colleague.id,
					}),
				}
			);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	const addWorkspaceColleague = async (colleague: IUser) => {
		await editBoardColleague(colleague, EDIT_COLLEAGUE_METHOD.POST);
		setRefreshBoard(true);
	};

	const removeWorkspaceColleague = async (colleague: IUser) => {
		await editBoardColleague(colleague, EDIT_COLLEAGUE_METHOD.DELETE);
		setRefreshBoard(true);
	};

	const deleteBoard = async () => {
		try {
			await fetch(
				`${import.meta.env.VITE_SERVER_URL}/boards/${boardId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			navigate(-1);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	return {
		state: {
			userData,
			boardData,
			isChatOpen,
			workspaceUsers,
			isCreateTaskModalOpen,
			isDeleteBoardModalOpen,
			isEditBoardUsersModalOpen,
		},
		operations: {
			goBack,
			deleteBoard,
			toggleIsChatOpen,
			addWorkspaceColleague,
			removeWorkspaceColleague,
			toggleIsCreateTaskModalOpen,
			toggleIsDeleteBoardModalOpen,
			toggleIsEditBoardUsersModalOpen,
		},
	};
};
