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

export interface IColumn {
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
	errorMessage: string;
	workspaceUsers: IUser[];
	selectedColumnId: number;
	selectedTask: ITask | null;
	errorMessageOpacity: number;
	boardData: IBoardData | null;
	isCreateTaskModalOpen: boolean;
	isDeleteBoardModalOpen: boolean;
	isEditBoardUsersModalOpen: boolean;
}

interface IBoardViewModelOperations {
	goBack(): void;
	addColumn(): void;
	deleteBoard(): void;
	callForRefresh(): void;
	toggleIsChatOpen(): void;
	onDragEnd(result: any): void;
	closeCreateTaskModal(): void;
	taskClickHandler(task: ITask): void;
	toggleIsDeleteBoardModalOpen(): void;
	toggleIsEditBoardUsersModalOpen(): void;
	addWorkspaceColleague(colleague: IUser): void;
	removeWorkspaceColleague(colleague: IUser): void;
	toggleIsCreateTaskModalOpen(columnId: number): void;
	updateColumnData(columnId: number, columnName: string): void;
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
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [refreshBoard, setRefreshBoard] = useState<boolean>(true);
	const [workspaceUsers, setWorkspaceUsers] = useState<IUser[]>([]);
	const [boardData, setBoardData] = useState<IBoardData | null>(null);
	const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
	const [selectedColumnId, setSelectedColumnId] = useState<number>(-1);
	const { accessToken, userData } = useOutletContext<IOutletContext>();
	const [errorMessageOpacity, setErrorMessageOpacity] = useState<number>(0);
	const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
	const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
	const [isEditBoardUsersModalOpen, setIsEditBoardUsersModalOpen] =
		useState(false);

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
				setRefreshBoard(false);
			} catch (err: any) {
				console.log(err.message);
			}
			setIsLoading(false);
		};

		if (!refreshBoard) return;
		fetchBoardData();
	}, [refreshBoard]);

	//make the error message fade out
	useEffect(() => {
		if (!errorMessage) {
			setErrorMessageOpacity(0);
		};

		const interval = setInterval(() => {
			setErrorMessageOpacity(0);
		}, 5000);

		return () => clearInterval(interval);
	}, [errorMessage, errorMessageOpacity]);

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
		const {
			draggableId: rawDraggableId,
			source,
			destination,
			type,
		} = result;

		if (!boardData) {
			return;
		}

		if (!destination) {
			return;
		}

		const draggableId = rawDraggableId.split('-').pop();
		const sourceDroppableId = source.droppableId.split('-').pop();
		const destinationDroppableId = destination?.droppableId
			.split('-')
			.pop();

		if (
			destination.index === source.index &&
			sourceDroppableId === destinationDroppableId
		) {
			return;
		}

		const startingBoardState = boardData;

		// make the api request without calling for refresh
		try {
			if (type === 'column') {
				//make optimistic update

				const selectedColumnIndex = boardData.columns.findIndex(
					(col) => col.id === Number(draggableId)
				);

				const updatedColumns = [...boardData.columns];
				const [selectedColumn] = updatedColumns.splice(
					selectedColumnIndex,
					1
				);
				updatedColumns.splice(destination.index, 0, selectedColumn);

				setBoardData((prev) => {
					if (!prev) {
						return null;
					}

					return {
						...prev,
						columns: updatedColumns,
					};
				});

				//make request
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
				//make optimistic update

				const srcColumn = boardData.columns.find(
					(col) => col.id === Number(sourceDroppableId)
				);
				const destColumn = boardData.columns.find(
					(col) => col.id === Number(destinationDroppableId)
				);

				if (!srcColumn || !destColumn) {
					return;
				}

				const srcColumnTasks = [...srcColumn.tasks];

				//case where task is moved between columns
				if (srcColumn.id !== destColumn.id) {
					const destColumnTasks = [...destColumn.tasks];

					const [task] = srcColumnTasks.splice(source.index, 1);
					destColumnTasks.splice(destination.index, 0, task);

					setBoardData((prev) => {
						if (!prev) {
							return null;
						}

						const updatedColumns = prev.columns.map((col) => {
							if (col.id === Number(sourceDroppableId)) {
								return {
									...col,
									tasks: srcColumnTasks,
								};
							}

							if (col.id === Number(destinationDroppableId)) {
								return {
									...col,
									tasks: destColumnTasks,
								};
							}

							return col;
						});

						return {
							...prev,
							columns: updatedColumns,
						};
					});
				} else {
					//case where task is changing only its position in the same column
					if (source.index === destination.index) {
						return;
					}

					if (destination.index >= destColumn.tasks.length) {
						destination.index = destColumn.tasks.length - 1;
					}

					const [task] = srcColumnTasks.splice(source.index, 1);
					srcColumnTasks.splice(destination.index, 0, task);

					setBoardData((prev) => {
						if (!prev) {
							return null;
						}

						const updatedColumns = prev.columns.map((col) => {
							if (col.id === srcColumn.id) {
								return {
									...col,
									tasks: srcColumnTasks,
								};
							}
							return col;
						});

						return {
							...prev,
							columns: updatedColumns,
						};
					});
				}

				//make request
				const res = await request({
					accessToken,
					method: METHODS.PUT,
					endpoint: TASK_ENDPOINTS.MOVE,
					body: {
						taskId: Number(draggableId),
						destinationPosition: destination.index,
						destinationColumnId: Number(destinationDroppableId),
					},
				});

				if (res.errorMessage) {
					throw new Error(res.errorMessage);
				}
			}
		} catch (err: any) {
			setBoardData(startingBoardState);
			console.log(err.messsage);
		}
	};

	const taskClickHandler = (task: ITask) => {
		setSelectedTask(task);
		toggleIsCreateTaskModalOpen(-1);
	};

	const closeCreateTaskModal = () => {
		setSelectedTask(null);
		toggleIsCreateTaskModalOpen(-1);
	};

	const addColumn = async () => {
		if (!boardData) return;
		try {
			const res = await request({
				body: {
					name: 'New column',
					boardId: boardData.id,
				},
				accessToken,
				method: METHODS.POST,
				endpoint: COLUMN_ENDPOINTS.BASE,
			});

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			setBoardData((prev) => {
				if (!prev) return null;

				return {
					...prev,
					columns: [
						...prev.columns,
						{
							tasks: [],
							id: res.columnId,
							boardId: prev.id,
							name: 'New column',
							position: prev.columns.length - 1,
						},
					],
				};
			});
		} catch (err: any) {
			setErrorMessageOpacity(1);
			setErrorMessage(err.message);
			console.log(err.message);
		}
	};

	const updateColumnData = (columnId: number, columnName: string) => {
		setBoardData((prev) => {
			if (!prev) return null;

			const columns = prev.columns.map((col) => {
				if (col.id === columnId) {
					col.name = columnName;
				}

				return col;
			});

			return {
				...prev,
				columns: [...columns],
			};
		});
	};

	return {
		state: {
			userData,
			isLoading,
			boardData,
			isChatOpen,
			errorMessage,
			selectedTask,
			workspaceUsers,
			selectedColumnId,
			errorMessageOpacity,
			isCreateTaskModalOpen,
			isDeleteBoardModalOpen,
			isEditBoardUsersModalOpen,
		},
		operations: {
			goBack,
			addColumn,
			onDragEnd,
			deleteBoard,
			callForRefresh,
			taskClickHandler,
			updateColumnData,
			toggleIsChatOpen,
			closeCreateTaskModal,
			addWorkspaceColleague,
			removeWorkspaceColleague,
			toggleIsCreateTaskModalOpen,
			toggleIsDeleteBoardModalOpen,
			toggleIsEditBoardUsersModalOpen,
		},
	};
};
