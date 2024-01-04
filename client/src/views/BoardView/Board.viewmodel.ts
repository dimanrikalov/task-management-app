import { useState } from 'react';
import { ITask } from '@/components/Task/Task';
import { useNavigate } from 'react-router-dom';
import { useEditBoard } from '@/hooks/useEditBoard';
import { useDragEvents } from '@/hooks/useDragEvents';
import { useRenameBoard } from '@/hooks/useRenameBoard';
import { useBoardContext } from '@/contexts/board.context';
import { useFetchAllUsers } from '@/hooks/useFetchAllUsers';
import { IDetailedWorkspace } from '@/contexts/workspace.context';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { useEditBoardColleagues } from '@/hooks/useEditBoardColleagues';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

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
	allUsers: IUser[];
	isLoading: boolean;
	isChatOpen: boolean;
	isInputModeOn: boolean;
	boardNameInput: string;
	workspaceUsers: IUser[];
	hasDragStarted: boolean;
	isTaskModalOpen: boolean;
	boardData: IBoardData | null;
	isDeleteBoardModalOpen: boolean;
	isEditBoardUsersModalOpen: boolean;
}

interface IBoardViewModelOperations {
	goBack(): void;
	addColumn(): void;
	deleteBoard(): void;
	onDragStart(): void;
	toggleIsChatOpen(): void;
	toggleIsInputModeOn(): void;
	onDragEnd(result: any): void;
	toggleIsTaskModalOpen(): void;
	toggleIsDeleteBoardModalOpen(): void;
	toggleIsEditBoardUsersModalOpen(): void;
	addBoardColleague(colleague: IUser): void;
	removeBoardColleague(colleague: IUser): void;
	handleBoardNameChange(e: React.FormEvent<HTMLFormElement>): void;
	handleBoardNameInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useBoardViewModel = (): ViewModelReturnType<
	IBoardViewModelState,
	IBoardViewModelOperations
> => {
	const {
		isInputModeOn,
		boardNameInput,
		toggleIsInputModeOn,
		handleBoardNameChange,
		handleBoardNameInputChange,
	} = useRenameBoard();
	const {
		addBoardColleague,
		removeBoardColleague,
		isEditBoardUsersModalOpen,
		toggleIsEditBoardUsersModalOpen,
	} = useEditBoardColleagues();
	const navigate = useNavigate();
	const { addColumn, deleteBoard } = useEditBoard();
	const [isChatOpen, setIsChatOpen] = useState(false);
	const { onDragEnd, onDragStart, hasDragStarted } = useDragEvents();

	const {
		boardData,
		isLoading,
		workspaceUsers,
		isTaskModalOpen,
		toggleIsTaskModalOpen,
	} = useBoardContext();
	const { allUsers, isLoading: isLoadingAllUsers } = useFetchAllUsers();
	const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);

	const goBack = () => {
		navigate(-1);
	};

	const toggleIsChatOpen = () => {
		setIsChatOpen((prev) => !prev);
	};

	const toggleIsDeleteBoardModalOpen = () => {
		setIsDeleteBoardModalOpen((prev) => !prev);
	};

	return {
		state: {
			allUsers,
			boardData,
			isChatOpen,
			isInputModeOn,
			boardNameInput,
			workspaceUsers,
			hasDragStarted,
			isTaskModalOpen,
			isDeleteBoardModalOpen,
			isEditBoardUsersModalOpen,
			isLoading: isLoading || isLoadingAllUsers,
		},
		operations: {
			goBack,
			addColumn,
			onDragEnd,
			onDragStart,
			deleteBoard,
			toggleIsChatOpen,
			addBoardColleague,
			toggleIsInputModeOn,
			removeBoardColleague,
			handleBoardNameChange,
			toggleIsTaskModalOpen,
			handleBoardNameInputChange,
			toggleIsDeleteBoardModalOpen,
			toggleIsEditBoardUsersModalOpen,
		},
	};
};
