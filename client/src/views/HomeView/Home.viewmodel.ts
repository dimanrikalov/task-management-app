import { deleteTokens } from '@/utils';
import { useState, useEffect } from 'react';
import { IOutletContext, IUserData } from '@/guards/authGuard';
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

export interface ISearchInputs {
	searchBoards: string;
	searchWorkspaces: string;
}

interface IModalsState {
	createBoardIsOpen: boolean;
	editProfileIsOpen: boolean;
	createWorkspaceIsOpen: boolean;
}

export interface IHomeBoardEntry {
	id: number;
	name: string;
	usersCount: number;
	workspaceName: string;
}

export interface IHomeWorkspaceEntry {
	id: number;
	name: string;
	ownerName: string;
	usersCount: number;
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
	userData: IUserData;
	filteredLists: ILists;
	userStats: IUserStats;
	modalsState: IModalsState;
	searchInputs: ISearchInputs;
}

interface IUserHomeViewmodelOperations {
	logout(): void;
	toggleModal(key: IModalsStateKeys): void;
	handleFilterInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
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
	const [filteredLists, setFilteredLists] = useState<ILists>({
		boards: [],
		workspaces: [],
	});

	const [searchInputs, setSearchInputs] = useState<ISearchInputs>({
		searchBoards: '',
		searchWorkspaces: '',
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

	useEffect(() => {
		setFilteredLists(() => ({
			boards: [...lists.boards],
			workspaces: [...lists.workspaces],
		}));
		console.log(lists);
	}, [lists]);

	useEffect(() => {
		setFilteredLists(() => {
			const boards = lists.boards.filter((x) =>
				x.name
					.trim()
					.toLowerCase()
					.includes(searchInputs.searchBoards.trim().toLowerCase())
			);
			const workspaces = lists.workspaces.filter(
				(x) =>
					x.name
						.trim()
						.toLowerCase()
						.includes(
							searchInputs.searchWorkspaces.trim().toLowerCase()
						) ||
					`${x.ownerName}`
						.trim()
						.toLowerCase()
						.includes(
							searchInputs.searchWorkspaces.trim().toLowerCase()
						)
			);

			return {
				boards,
				workspaces,
			};
		});
	}, [searchInputs]);

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

	const handleFilterInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setSearchInputs((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
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
			userData,
			userStats,
			modalsState,
			searchInputs,
			filteredLists,
		},
		operations: {
			logout,
			toggleModal,
			handleFilterInputChange,
		},
	};
};
