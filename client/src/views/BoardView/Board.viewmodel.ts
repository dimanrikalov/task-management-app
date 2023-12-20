import {
	request,
	METHODS,
	TASK_ENDPOINTS,
	BOARD_ENDPOINTS,
	COLUMN_ENDPOINTS,
} from '@/utils/requester';
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
	index: number;
	droppableId: string;
}

export interface IResult {
	type: string;
	reason?: string;
	source: ISource;
	draggableId: string;
	destination: ISource | null;
}

interface IBoardViewModelState {
	userData: IUser;
	isLoading: boolean;
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
	const boardId = Number(pathname.split('/').pop());
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [refreshBoard, setRefreshBoard] = useState<boolean>(true);
	const [workspaceUsers, setWorkspaceUsers] = useState<IUser[]>([]);
	const [boardData, setBoardData] = useState<IBoardData | null>(null);
	const [selectedColumnId, setSelectedColumnId] = useState<number>(-1);
	const { accessToken, userData } = useOutletContext<IOutletContext>();
	const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
	const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
	const [isEditBoardUsersModalOpen, setIsEditBoardUsersModalOpen] =
		useState(false);

	useEffect(() => {
		const fetchBoardData = async () => {
			try {
				setIsLoading(true);

				const boardData = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: BOARD_ENDPOINTS.DETAILS(boardId),
				})) as IBoardData;
				console.log(boardData);

				//add workspace owner to the users with access to the workspace, and filter out the currently logged user
				const workspaceUsers = [
					...boardData.workspace.workspaceUsers,
					boardData.workspace.workspaceOwner,
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

				const boardUsers = boardData.boardUsers
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
					...boardData,
					boardUsers: [...workspaceUsers, ...boardUsers],
				});
				setWorkspaceUsers(workspaceUsers);
				setRefreshBoard(false);
			} catch (err: any) {
				console.log(err.message);
			}
			setIsLoading(false);
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
			await request({
				method,
				accessToken,
				body: { colleagueId: colleague.id },
				endpoint: BOARD_ENDPOINTS.COLLEAGUES(boardData.id),
			});
		} catch (err: any) {
			console.log(err.message);
		}
	};

	const addWorkspaceColleague = async (colleague: IUser) => {
		await editBoardColleague(colleague, METHODS.POST);
		setRefreshBoard(true);
	};

	const removeWorkspaceColleague = async (colleague: IUser) => {
		await editBoardColleague(colleague, METHODS.DELETE);
		setRefreshBoard(true);
	};

	const deleteBoard = async () => {
		try {
			await request({
				accessToken,
				method: METHODS.DELETE,
				endpoint: BOARD_ENDPOINTS.BOARD(boardId),
			});
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

		try {
			if (type === 'column') {
				await request({
					accessToken,
					method: METHODS.PUT,
					endpoint: COLUMN_ENDPOINTS.MOVE,
					body: {
						columnId: Number(draggableId),
						destinationPosition: destination.index,
					},
				});
			} else {
				await request({
					accessToken,
					method: METHODS.PUT,
					endpoint: TASK_ENDPOINTS.MOVE,
					body: {
						taskId: Number(draggableId),
						destinationPosition: destination.index,
						destinationColumnId: Number(destination.droppableId),
					},
				});
			}
			callForRefresh();
		} catch (err: any) {
			console.log(err.messsage);
		}
	};

	return {
		state: {
			userData,
			boardData,
			isLoading,
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
