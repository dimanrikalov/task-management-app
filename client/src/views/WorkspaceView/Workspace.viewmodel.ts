import {
	IDetailedBoard,
	IDetailedWorkspace,
} from '../CreateBoardView/CreateBoard.viewmodel';
import { ROUTES } from '@/router';
import { useState, useEffect } from 'react';
import { IUserData } from '@/app/userSlice';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { setWorkspaceName } from '@/app/inputValuesSlice';
import { resetTaskModalData } from '@/app/taskModalSlice';
import { toggleCreateBoardModal } from '@/app/modalsSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { METHODS, WORKSPACE_ENDPOINTS, request } from '@/utils/requester';

export enum MODAL_STATES_KEYS {
	EDIT_COLLEAGUES = 'editColleaguesIsOpen',
	DELETE_WORKSPACE = 'deleteWorkspaceIsOpen',
}

export type EDIT_COLLEAGUE_METHOD = METHODS.POST | METHODS.DELETE;

type IModalStates = {
	[key in MODAL_STATES_KEYS]: boolean;
};

interface IWorkspaceViewModelState {
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
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { pathname } = useLocation();
	const [workspaceData, setWorkspaceData] =
		useState<IDetailedWorkspace | null>(null);
	const [inputValue, setInputValue] = useState('');
	const workspaceId = Number(pathname.split('/').pop());
	const [refreshWorkspace, setRefreshWorkspace] = useState(true);
	const [isInputModeOn, setIsInputModeOn] = useState<boolean>(false);
	const [workspaceNameInput, setWorkspaceNameInput] = useState<string>('');
	const [filteredBoards, setFilteredBoards] = useState<IDetailedBoard[]>([]);
	const { data: userData, accessToken } = useAppSelector(
		(state) => state.user
	) as { data: IUserData; accessToken: string };
	const [modals, setModals] = useState<IModalStates>({
		[MODAL_STATES_KEYS.EDIT_COLLEAGUES]: false,
		[MODAL_STATES_KEYS.DELETE_WORKSPACE]: false,
	});

	//solves the board loading bug
	useEffect(() => {
		dispatch(resetTaskModalData());
	}, []);

	//search filter
	useEffect(() => {
		setFilteredBoards(
			(workspaceData?.boards || []).filter((board) =>
				board.name
					.trim()
					.toLowerCase()
					.includes(inputValue.trim().toLowerCase())
			)
		);
	}, [inputValue]);

	useEffect(() => {
		const fetchWorkspace = async () => {
			try {
				const workspaceData = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: WORKSPACE_ENDPOINTS.DETAILS(workspaceId),
				})) as IDetailedWorkspace;

				//add workspace owner to the users with access to the workspace, and filter out the currently logged user
				const workspaceUsers = [
					workspaceData.workspaceOwner,
					...workspaceData.workspaceUsers,
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

				workspaceData.workspaceUsers = workspaceUsers;

				setWorkspaceData(workspaceData);
				setFilteredBoards(workspaceData.boards);
				setRefreshWorkspace(false);
			} catch (err: any) {
				console.log(err.message);
				dispatch(setErrorMessageAsync(err.message));
			}
		};

		if (refreshWorkspace) {
			fetchWorkspace();
		}
	}, [refreshWorkspace]);

	const backBtnHandler = () => {
		navigate(-1);
	};

	const goToBoard = (boardId: number) => {
		navigate(ROUTES.BOARD(boardId));
	};

	const toggleModal = (key: MODAL_STATES_KEYS) => {
		setModals((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const toggleIsCreateBoardModalOpen = () => {
		if (!workspaceData) return;
		dispatch(toggleCreateBoardModal());
		dispatch(setWorkspaceName({ workspaceName: workspaceData.name }));
	};

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const addWorkspaceColleague = async (colleague: IUser) => {
		await editWorkspaceColleague(colleague, METHODS.POST);
		setRefreshWorkspace(true);
	};

	const removeWorkspaceColleague = async (colleague: IUser) => {
		await editWorkspaceColleague(colleague, METHODS.DELETE);
		setRefreshWorkspace(true);
	};

	const deleteWorkspace = async () => {
		if (!workspaceData) {
			throw new Error('Workspace data missing!');
		}
		try {
			await request({
				accessToken,
				method: METHODS.DELETE,
				endpoint: WORKSPACE_ENDPOINTS.WORKSPACE(workspaceData.id),
			});
			navigate(ROUTES.DASHBOARD);
		} catch (err: any) {
			console.log(err.message);
			dispatch(setErrorMessageAsync(err.message));
		}
	};

	const editWorkspaceColleague = async (
		colleague: IUser,
		method: EDIT_COLLEAGUE_METHOD
	) => {
		if (!workspaceData) {
			console.log('No workspace data!');
			return;
		}

		try {
			await request({
				method,
				accessToken,
				body: { colleagueId: colleague.id },
				endpoint: WORKSPACE_ENDPOINTS.COLLEAGUES(workspaceData.id),
			});
		} catch (err: any) {
			console.log(err.message);
			dispatch(setErrorMessageAsync(err.message));
		}
	};

	const handleWorkspaceNameInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setWorkspaceNameInput(e.target.value);
	};

	const toggleIsInputModeOn = () => {
		if (!workspaceData) return;
		setIsInputModeOn((prev) => !prev);
		setWorkspaceNameInput(workspaceData.name);
	};

	const handleWorkspaceNameChange = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		if (!workspaceData) return;

		if (workspaceData.name === workspaceNameInput) {
			setIsInputModeOn(false);
			return;
		}

		try {
			const data = await request({
				accessToken,
				method: METHODS.PUT,
				endpoint: WORKSPACE_ENDPOINTS.RENAME(workspaceData.id),
				body: {
					newName: workspaceNameInput.trim(),
				},
			});

			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			setWorkspaceData((prev) => {
				if (!prev) return null;

				return {
					...prev,
					name: workspaceNameInput,
				};
			});
		} catch (err: any) {
			console.log(err.message);
			dispatch(setErrorMessageAsync(err.message));
		}
		setIsInputModeOn(false);
	};

	return {
		state: {
			modals,
			userData,
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
