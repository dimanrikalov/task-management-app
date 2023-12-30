import {
	request,
	METHODS,
	BOARD_ENDPOINTS,
	WORKSPACE_ENDPOINTS,
} from '@/utils/requester';
import { ROUTES } from '@/router';
import { deleteTokens } from '@/utils';
import { useState, useEffect, useContext } from 'react';
import { IOutletContext, IUserData } from '@/guards/authGuard';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ErrorContext, IErrorContext } from '@/contexts/ErrorContext';
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

interface IUseHomeViewmodelState {
	date: string;
	userData: IUserData;
	filteredLists: ILists;
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

	const date = new Date().toLocaleDateString('en-US', options);
	const { setErrorMessage } = useContext<IErrorContext>(ErrorContext);
	const { accessToken, userData } = useOutletContext<IOutletContext>();

	useEffect(() => {
		const fetchEntries = async (entries: ENTRIES_TYPES) => {
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
				setErrorMessage(err.message);
			}
		};

		fetchEntries(ENTRIES_TYPES.BOARDS);
		fetchEntries(ENTRIES_TYPES.WORKSPACES);
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
		navigate(ROUTES.HOME);
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

	return {
		state: {
			date,
			userData,
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
