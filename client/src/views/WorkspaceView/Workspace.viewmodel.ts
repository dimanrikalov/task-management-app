import {
	IDetailedWorkspace,
	useWorkspaceContext,
} from '@/contexts/workspace.context';
import { ROUTES } from '@/router';
import { METHODS } from '@/utils/requester';
import { IUserData } from '@/app/userSlice';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';
import { useEditWorkspace } from '@/hooks/useEditWorkspace';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { IDetailedBoard } from '../CreateBoardView/CreateBoard.viewmodel';
import { useEditWorkspaceColleagues } from '@/hooks/useEditWorkspaceColleagues';

export enum MODAL_STATES_KEYS {
	EDIT_COLLEAGUES = 'editColleaguesIsOpen',
	DELETE_WORKSPACE = 'deleteWorkspaceIsOpen',
}

export type EDIT_COLLEAGUE_METHOD = METHODS.POST | METHODS.DELETE;

type IModalStates = {
	[key in MODAL_STATES_KEYS]: boolean;
};

interface IWorkspaceViewModelState {
	isLoading: boolean;
	inputValue: string;
	userData: IUserData;
	modals: IModalStates;
	isInputModeOn: boolean;
	workspaceNameInput: string;
	filteredBoards: IDetailedBoard[];
	workspaceData: IDetailedWorkspace | null;
}

interface IWorkspaceViewModelOperations {
	backBtnHandler(): void;
	deleteWorkspace(): void;
	toggleIsInputModeOn(): void;
	toggleModal(key: string): void;
	goToBoard(boardId: number): void;
	toggleIsCreateBoardModalOpen(): void;
	addWorkspaceColleague(colleague: IUser): void;
	removeWorkspaceColleague(colleague: IUser): void;
	inputChangeHandler(e: React.ChangeEvent<HTMLInputElement>): void;
	handleWorkspaceNameInputChange(
		e: React.ChangeEvent<HTMLInputElement>
	): void;
	handleWorkspaceNameChange(
		e: React.FormEvent<HTMLFormElement>
	): Promise<void>;
}

export const useWorkspaceViewModel = (): ViewModelReturnType<
	IWorkspaceViewModelState,
	IWorkspaceViewModelOperations
> => {
	const {
		isInputModeOn,
		deleteWorkspace,
		workspaceNameInput,
		toggleIsInputModeOn,
		handleWorkspaceNameChange,
		toggleIsCreateBoardModalOpen,
		handleWorkspaceNameInputChange,
	} = useEditWorkspace();
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');
	const { workspaceData, isLoading } = useWorkspaceContext();
	const [filteredBoards, setFilteredBoards] = useState<IDetailedBoard[]>([]);
	const { addWorkspaceColleague, removeWorkspaceColleague } =
		useEditWorkspaceColleagues();
	const { data: userData } = useAppSelector((state) => state.user) as {
		data: IUserData;
	};
	const [modals, setModals] = useState<IModalStates>({
		[MODAL_STATES_KEYS.EDIT_COLLEAGUES]: false,
		[MODAL_STATES_KEYS.DELETE_WORKSPACE]: false,
	});

	//search filter
	useEffect(() => {
		if (!workspaceData) return;
		setFilteredBoards(
			workspaceData.boards.filter((board) =>
				board.name
					.trim()
					.toLowerCase()
					.includes(inputValue.trim().toLowerCase())
			)
		);
	}, [inputValue, workspaceData]);

	const backBtnHandler = () => {
		navigate(-1);
	};

	const goToBoard = (boardId: number) => {
		navigate(ROUTES.BOARD(boardId));
	};

	const toggleModal = (key: MODAL_STATES_KEYS) => {
		setModals((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	return {
		state: {
			modals,
			userData,
			isLoading,
			inputValue,
			workspaceData,
			isInputModeOn,
			filteredBoards,
			workspaceNameInput,
		},
		operations: {
			goToBoard,
			toggleModal,
			backBtnHandler,
			deleteWorkspace,
			inputChangeHandler,
			toggleIsInputModeOn,
			addWorkspaceColleague,
			removeWorkspaceColleague,
			handleWorkspaceNameChange,
			toggleIsCreateBoardModalOpen,
			handleWorkspaceNameInputChange,
		},
	};
};
