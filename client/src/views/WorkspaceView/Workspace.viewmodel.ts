import {
	IDetailedBoard,
	IDetailedWorkspace,
} from '../CreateBoardView/CreateBoard.viewmodel';
import { ROUTES } from '@/router';
import { useState, useEffect, useContext } from 'react';
import { IOutletContext, IUserData } from '@/guards/authGuard';
import { ErrorContext, IErrorContext } from '@/contexts/ErrorContext';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { METHODS, WORKSPACE_ENDPOINTS, request } from '@/utils/requester';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

export enum MODAL_STATES_KEYS {
	CREATE_BOARD = 'createBoardIsOpen',
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
	filteredBoards: IDetailedBoard[];
	workspaceData: IDetailedWorkspace | null;
}

interface IWorkspaceViewModelOperations {
	backBtnHandler(): void;
	deleteWorkspace(): void;
	toggleModal(key: string): void;
	goToBoard(boardId: number): void;
	addWorkspaceColleague(colleague: IUser): void;
	removeWorkspaceColleague(colleague: IUser): void;
	inputChangeHandler(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useWorkspaceViewModel = (): ViewModelReturnType<
	IWorkspaceViewModelState,
	IWorkspaceViewModelOperations
> => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [workspaceData, setWorkspaceData] =
		useState<IDetailedWorkspace | null>(null);
	const [inputValue, setInputValue] = useState('');
	const workspaceId = Number(pathname.split('/').pop());
	const [refreshWorkspace, setRefreshWorkspace] = useState(true);
	const { setErrorMessage } = useContext<IErrorContext>(ErrorContext);
	const { userData, accessToken } = useOutletContext<IOutletContext>();
	const [filteredBoards, setFilteredBoards] = useState<IDetailedBoard[]>([]);
	const [modals, setModals] = useState<IModalStates>({
		[MODAL_STATES_KEYS.CREATE_BOARD]: false,
		[MODAL_STATES_KEYS.EDIT_COLLEAGUES]: false,
		[MODAL_STATES_KEYS.DELETE_WORKSPACE]: false,
	});

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
				setErrorMessage(err.message);
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
			setErrorMessage(err.message);
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
			setErrorMessage(err.message);
		}
	};

	return {
		state: {
			modals,
			userData,
			inputValue,
			workspaceData,
			filteredBoards,
		},
		operations: {
			goToBoard,
			toggleModal,
			backBtnHandler,
			deleteWorkspace,
			inputChangeHandler,
			addWorkspaceColleague,
			removeWorkspaceColleague,
		},
	};
};
