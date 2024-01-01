import {
	request,
	METHODS,
	BOARD_ENDPOINTS,
	WORKSPACE_ENDPOINTS,
} from '@/utils/requester';
import { ROUTES } from '@/router';
import { deleteTokens } from '@/utils';
import { useState, useEffect } from 'react';
import { IUserData } from '@/app/userSlice';
import { useNavigate } from 'react-router-dom';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
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
	isLoading: boolean;
	userData: IUserData;
	filteredLists: ILists;
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
	handleFilterInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useHomeViewModel = (): ViewModelReturnType<
	IUseHomeViewmodelState,
	IUserHomeViewmodelOperations
> => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [lists, setLists] = useState<ILists>({
		boards: [],
		workspaces: [],
	});
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [filteredLists, setFilteredLists] = useState<ILists>({
		boards: [],
		workspaces: [],
	});
	const [searchInputs, setSearchInputs] = useState<ISearchInputs>({
		searchBoards: '',
		searchWorkspaces: '',
	});

	const date = new Date().toLocaleDateString('en-US', options);
	const { data: userData, accessToken } = useAppSelector(
		(state) => state.user
	) as { data: IUserData; accessToken: string };

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
			} catch (err: any) {
				console.log(err.message);
				dispatch(setErrorMessageAsync(err.message));
			}
		};

		setIsLoading(true);
		fetchEntries(ENTRIES_TYPES.BOARDS);
		fetchEntries(ENTRIES_TYPES.WORKSPACES);
	}, [accessToken]);

	useEffect(() => {
		setFilteredLists(() => ({
			boards: [...lists.boards],
			workspaces: [...lists.workspaces],
		}));

		//delaying so that no entries message doesnt display before completing the fetch process
		const timeoout = setTimeout(() => {
			setIsLoading(false);
		}, 30);
		console.log(lists);
		return () => clearTimeout(timeoout);
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

	const handleFilterInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target;
		setSearchInputs((prevInputFields) => ({
			...prevInputFields,
			[name]: value,
		}));
	};

	return {
		state: {
			date,
			userData,
			isLoading,
			searchInputs,
			filteredLists,
		},
		operations: {
			logout,
			handleFilterInputChange,
		},
	};
};
