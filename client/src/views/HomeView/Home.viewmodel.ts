import { deleteTokens } from '@/utils';
import { useState, useEffect } from 'react';
import { IJWTPayload, IOutletContext } from '@/guards/authGuard';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

enum EntriesType {
	BOARDS = 'boards',
	WORKSPACES = 'workspaces',
}

export enum IModalsStateKeys {
	CREATE_BOARD_IS_OPEN = 'createBoardIsOpen',
	EDIT_PROFILE_IS_OPEN = 'editProfileIsOpen',
	CREATE_WORKSPACE_IS_OPEN = 'createWorkspaceIsOpen',
}

interface IModalsState {
	createBoardIsOpen: boolean;
	editProfileIsOpen: boolean;
	createWorkspaceIsOpen: boolean;
}

interface IHomeBoardEntry {
	id: number;
	name: string;
	workspaceId: number;
}

interface IUser {
	id: number;
	lastName: string;
	firstName: string;
}

interface IHomeWorkspaceEntry {
	User: IUser;
	id: number;
	name: string;
	_count: number;
}

interface ILists {
	boards: IHomeBoardEntry[];
	workspaces: IHomeWorkspaceEntry[];
}

export interface IUserStats {
	boardsCount: number;
	messagesCount: number;
	workspacesCount: number;
	pendingTasksCount: number;
	completedTasksCount: number;
}

interface IUseHomeViewmodelState {
	lists: ILists;
	userStats: IUserStats;
	userData: IJWTPayload;
	modalsState: IModalsState;
}

interface IUserHomeViewmodelOperations {
	logout(): void;
	toggleModal(key: IModalsStateKeys): void;
}

export const useHomeViewModel = (): ViewModelReturnType<
	IUseHomeViewmodelState,
	IUserHomeViewmodelOperations
> => {
	const navigate = useNavigate();
	const [lists, setLists] = useState<ILists>({
		boards: [],
		workspaces: [],
	});
	const [modalsState, setModalsState] = useState<IModalsState>({
		createBoardIsOpen: false,
		editProfileIsOpen: false,
		createWorkspaceIsOpen: false,
	});
	const [userStats, setUserStats] = useState<IUserStats>({
		boardsCount: -1,
		messagesCount: -1,
		workspacesCount: -1,
		pendingTasksCount: -1,
		completedTasksCount: -1,
	});
	const { accessToken, userData } = useOutletContext<IOutletContext>();

	useEffect(() => {
		fetchUserStats(accessToken);
		fetchEntries(accessToken, EntriesType.BOARDS);
		fetchEntries(accessToken, EntriesType.WORKSPACES);
	}, [accessToken]);

	const logout = () => {
		deleteTokens();
		navigate('/');
	};

	const toggleModal = (key: IModalsStateKeys) => {
		setModalsState((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const fetchEntries = async (accessToken: string, entries: EntriesType) => {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/${entries}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			const data = await res.json();
			setLists((prev) => ({ ...prev, [entries]: data }));
			console.log(data);
		} catch (err: any) {
			console.log(err.message);
			if (
				['Unauthorized access!', 'Invalid JWT token!'].includes(
					err.message
				)
			) {
				navigate('/');
			}
		}
	};

	const fetchUserStats = async (accessToken: string) => {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/users/stats`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			const data = await res.json();
			console.log(data);
			setUserStats(data);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	return {
		state: {
			lists,
			userData,
			userStats,
			modalsState,
		},
		operations: {
			logout,
			toggleModal,
		},
	};
};
