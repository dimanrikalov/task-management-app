import { useState, useEffect } from 'react';
import { IOutletContext, IUserData } from '@/guards/authGuard';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { IDetailedWorkspace } from '../CreateBoardView/CreateBoard.viewmodel';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

export enum MODAL_STATES_KEYS {
	CREATE_BOARD = 'createBoardIsOpen',
	EDIT_COLLEAGUES = 'editColleaguesIsOpen',
	DELETE_WORKSPACE = 'deleteWorkspaceIsOpen',
}

export enum EDIT_COLLEAGUE_METHOD {
	POST = 'POST',
	DELETE = 'DELETE',
}

type IModalStates = {
	[key in MODAL_STATES_KEYS]: boolean;
};

interface IWorkspaceViewModelState {
	inputValue: string;
	userData: IUserData;
	modals: IModalStates;
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
	const workspaceId = pathname.split('/').pop();
	const [inputValue, setInputValue] = useState('');
	const [refreshWorkspace, setRefreshWorkspace] = useState(true);
	const { userData, accessToken } = useOutletContext<IOutletContext>();
	const [modals, setModals] = useState<IModalStates>({
		[MODAL_STATES_KEYS.CREATE_BOARD]: false,
		[MODAL_STATES_KEYS.EDIT_COLLEAGUES]: false,
		[MODAL_STATES_KEYS.DELETE_WORKSPACE]: false,
	});

	useEffect(() => {
		const fetchWorkspace = async () => {
			try {
				const res = await fetch(
					`${
						import.meta.env.VITE_SERVER_URL
					}/workspaces/${workspaceId}/details`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				const data = (await res.json()) as IDetailedWorkspace;

				let workspaceUsers = [
					data.workspaceOwner,
					...data.workspaceUsers,
				];

				workspaceUsers = workspaceUsers.filter(
					(user) => user.id !== userData.id
				).map(user => ({...user, profileImagePath: `data:image/png;base64,${user.profileImagePath}`}));

				workspaceUsers.unshift({
					email: 'Me',
					id: userData.id,
					profileImagePath: userData.profileImagePath,
				});

				setWorkspaceData({
					...data,
					workspaceUsers,
				});
				
				setRefreshWorkspace(false);
			} catch (err: any) {
				console.log(err.message);
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
		navigate(`/boards/${boardId}`);
	};

	const toggleModal = (key: MODAL_STATES_KEYS) => {
		setModals((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const addWorkspaceColleague = async (colleague: IUser) => {
		await editWorkspaceColleague(colleague, EDIT_COLLEAGUE_METHOD.POST);
		setRefreshWorkspace(true);
	};

	const removeWorkspaceColleague = async (colleague: IUser) => {
		await editWorkspaceColleague(colleague, EDIT_COLLEAGUE_METHOD.DELETE);
		setRefreshWorkspace(true);
	};

	const deleteWorkspace = async () => {
		if (!workspaceData) {
			throw new Error('Workspace data missing!');
		}
		try {
			await fetch(
				`${import.meta.env.VITE_SERVER_URL}/workspaces/${
					workspaceData.id
				}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			navigate('/dashboard');
		} catch (err: any) {
			console.log(err.message);
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
			await fetch(
				`${import.meta.env.VITE_SERVER_URL}/workspaces/${
					workspaceData.id
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

	return {
		state: {
			modals,
			userData,
			inputValue,
			workspaceData,
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
