import {
	request,
	METHODS,
	USER_ENDPOINTS,
	BOARD_ENDPOINTS,
	WORKSPACE_ENDPOINTS,
} from '@/utils/fetcher';
import { deleteTokens } from '@/utils';
import { useState, useEffect } from 'react';
import { IOutletContext, IUserData } from '@/guards/authGuard';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

export enum ENTRIES_TYPES {
	BOARDS = 'boards',
	WORKSPACES = 'workspaces',
}

export enum MODALS_STATE_KEYS {
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
	date: string;
	userData: IUserData;
	filteredLists: ILists;
	userStats: IUserStats;
	modalsState: IModalsState;
	searchInputs: ISearchInputs;
}

const options: Intl.DateTimeFormatOptions = {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
	weekday: 'long',
};

interface IUserHomeViewmodelOperations {
	logout(): void;
	toggleModal(key: MODALS_STATE_KEYS): void;
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
	const date = new Date().toLocaleDateString('en-US', options);
	const { accessToken, userData } = useOutletContext<IOutletContext>();

	useEffect(() => {
		fetchUserStats(accessToken);
		fetchEntries(accessToken, ENTRIES_TYPES.BOARDS);
		fetchEntries(accessToken, ENTRIES_TYPES.WORKSPACES);
	}, [accessToken]);

	useEffect(() => {
		setFilteredLists(() => ({
			boards: [...lists.boards],
			workspaces: [...lists.workspaces],
		}));
		console.log(lists);
	}, [lists]);

	//filter out entries based on search inputs
	useEffect(() => {
		const filterBoards = (input: string, entries: IHomeBoardEntry[]) => {
			return entries.filter((entry) =>
				entry.name
					.trim()
					.toLowerCase()
					.includes(input.trim().toLowerCase())
			);
		};

		const filterWorkspaces = (
			input: string,
			entries: IHomeWorkspaceEntry[]
		) => {
			return entries.filter(
				(entry) =>
					entry.name
						.trim()
						.toLowerCase()
						.includes(input.trim().toLowerCase()) ||
					entry.ownerName
						.trim()
						.toLowerCase()
						.includes(
							searchInputs.searchWorkspaces.trim().toLowerCase()
						)
			);
		};

		setFilteredLists(() => {
			return {
				boards: filterBoards(searchInputs.searchBoards, lists.boards),
				workspaces: filterWorkspaces(
					searchInputs.searchWorkspaces,
					lists.workspaces
				),
			};
		});
	}, [searchInputs]);

	const logout = () => {
		deleteTokens();
		navigate('/');
	};

	const toggleModal = (key: MODALS_STATE_KEYS) => {
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

	const fetchUserStats = async (accessToken: string) => {
		try {
			const data = await request({
				accessToken,
				method: METHODS.GET,
				endpoint: USER_ENDPOINTS.STATS,
			});
			setUserStats(data);
			console.log(data);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	const fetchEntries = async (
		accessToken: string,
		entries: ENTRIES_TYPES
	) => {
		try {
			const data = await request({
				accessToken,
				method: METHODS.GET,
				endpoint:
					entries === ENTRIES_TYPES.BOARDS
						? BOARD_ENDPOINTS.BASE
						: WORKSPACE_ENDPOINTS.BASE,
			});

			setLists((prev) => ({ ...prev, [entries]: data }));
			console.log(data);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	return {
		state: {
			date,
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
