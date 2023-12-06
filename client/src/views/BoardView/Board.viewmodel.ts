import { useEffect, useState } from 'react';
import { ITask } from '@/components/Task/Task';
import { IOutletContext } from '@/guards/authGuard';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { EDIT_COLLEAGUE_METHOD } from '../WorkspaceView/Workspace.viewmodel';
import { IDetailedWorkspace } from '../CreateBoardView/CreateBoard.viewmodel';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

interface IColumn {
	id: number;
	name: string;
	tasks: ITask[];
	boardId: number;
	position: number;
}

interface IBoardData {
	id: number;
	name: string;
	columns: IColumn[];
	boardUsers: IUser[];
	workspaceId: number;
	workspace: IDetailedWorkspace;
}

interface ISource {
	droppableId: string;
	index: number;
}

export interface IResult {
	draggableId: string;
	type: string;
	reason?: string;
	source: ISource;
	destination: ISource | null;
}

interface IBoardViewModelState {
	userData: IUser;
	isChatOpen: boolean;
	workspaceUsers: IUser[];
	selectedColumnId: number;
	boardData: IBoardData | null;
	isCreateTaskModalOpen: boolean;
	isDeleteBoardModalOpen: boolean;
	isEditBoardUsersModalOpen: boolean;
}

interface IBoardViewModelOperations {
	goBack(): void;
	deleteBoard(): void;
	callForRefresh(): void;
	toggleIsChatOpen(): void;
	onDragEnd(result: any): void;
	toggleIsDeleteBoardModalOpen(): void;
	toggleIsEditBoardUsersModalOpen(): void;
	addWorkspaceColleague(colleague: IUser): void;
	removeWorkspaceColleague(colleague: IUser): void;
	toggleIsCreateTaskModalOpen(columnId: number): void;
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
	const [selectedColumnId, setSelectedColumnId] = useState<number>(-1);
	const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
	const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
	const [isEditBoardUsersModalOpen, setIsEditBoardUsersModalOpen] =
		useState(false);

	useEffect(() => {
		const fetchBoardData = async () => {
			try {
				//fetch board
				const res = await fetch(
					`${
						import.meta.env.VITE_SERVER_URL
					}/boards/${boardId}/details`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${accessToken}`,
						},
						credentials: 'include',
					}
				);

				const boardData = (await res.json()) as IBoardData;

				console.log(boardData);

				let workspaceUsers = [
					...boardData.workspace.workspaceUsers,
					boardData.workspace.workspaceOwner,
				];

				//remove user from the array if the user is currently logged in
				workspaceUsers = workspaceUsers.filter(
					(user) => user.id !== userData.id
				);
				//add the currently logged in user as Me
				workspaceUsers.unshift({
					id: userData.id,
					email: 'Me',
					profileImagePath: userData.profileImagePath,
				});

				const boardUsers = boardData.boardUsers.filter((user) => {
					if (
						!workspaceUsers.some(
							(workspaceUser) => workspaceUser.id === user.id
						)
					) {
						return user;
					}
				});
				setBoardData({
					...boardData,
					boardUsers: [...workspaceUsers, ...boardUsers],
				});
				setWorkspaceUsers(workspaceUsers);
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

	const toggleIsCreateTaskModalOpen = (columnId: number) => {
		setIsCreateTaskModalOpen((prev) => {
			if (!prev === true) {
				setSelectedColumnId(columnId);
			}

			return !prev;
		});
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

	const callForRefresh = () => {
		setRefreshBoard(true);
	};

	const onDragEnd = async (result: IResult) => {
		const { draggableId, source, destination, type } = result;

		if (!destination) {
			return;
		}

		if (
			destination.index === source.index &&
			destination.droppableId === source.droppableId
		) {
			return;
		}

		if (type === 'column') {
			try {
				await fetch(`${import.meta.env.VITE_SERVER_URL}/columns/move`, {
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						columnId: Number(draggableId),
						destinationPosition: destination.index,
					}),
				});

				callForRefresh();
			} catch (err: any) {
				console.log(err.messsage);
			}
		} else {
			//TASK CASE
			try {
				await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks/move`, {
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						taskId: Number(draggableId),
						destinationColumnId: Number(destination.droppableId), //the column where it is being dropped in
						destinationPosition: destination.index, //need to somehow get the position of where it is going to be placed
					}),
				});

				callForRefresh();
			} catch (err: any) {
				console.log(err.message);
			}
		}
	};

	return {
		state: {
			userData,
			boardData,
			isChatOpen,
			workspaceUsers,
			selectedColumnId,
			isCreateTaskModalOpen,
			isDeleteBoardModalOpen,
			isEditBoardUsersModalOpen,
		},
		operations: {
			goBack,
			onDragEnd,
			deleteBoard,
			callForRefresh,
			toggleIsChatOpen,
			addWorkspaceColleague,
			removeWorkspaceColleague,
			toggleIsCreateTaskModalOpen,
			toggleIsDeleteBoardModalOpen,
			toggleIsEditBoardUsersModalOpen,
		},
	};
};
