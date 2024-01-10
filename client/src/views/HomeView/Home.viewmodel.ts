import {
	IUserData,
	useUserContext,
	IUserContextSecure,
} from '../../contexts/user.context';
import {
	IHomeBoardEntry,
	useFetchHomeLists,
	IHomeWorkspaceEntry,
} from '../../hooks/useFetchHomeLists';
import { useEffect, useState } from 'react';
import { ViewModelReturnType } from '../../interfaces/viewModel.interface';

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

interface IFilteredLists {
	boards: IHomeBoardEntry[];
	workspaces: IHomeWorkspaceEntry[];
}

interface IUseHomeViewmodelState {
	date: string;
	userData: IUserData;
	isLoadingBoards: boolean;
	searchInputs: ISearchInputs;
	isLoadingWorkspaces: boolean;
	filteredLists: IFilteredLists;
}

const options: Intl.DateTimeFormatOptions = {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
	weekday: 'long',
};

interface IUserHomeViewmodelOperations {
	handleFilterInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useHomeViewModel = (): ViewModelReturnType<
	IUseHomeViewmodelState,
	IUserHomeViewmodelOperations
> => {
	const {
		lists,
		isLoadingBoards,
		setIsLoadingBoards,
		isLoadingWorkspaces,
		setIsLoadingWorkspaces,
	} = useFetchHomeLists();
	const date = new Date()
		.toLocaleDateString('en-US', options)
		.split(',')
		.join(' ');
	const { data: userData } = useUserContext() as IUserContextSecure;
	const [filteredLists, setFilteredLists] = useState<IFilteredLists>({
		boards: [],
		workspaces: [],
	});
	const [searchInputs, setSearchInputs] = useState<ISearchInputs>({
		searchBoards: '',
		searchWorkspaces: '',
	});

	useEffect(() => {
		if (!lists.boards) return;
		setFilteredLists((prev) => ({
			...prev,
			boards: lists.boards as IHomeBoardEntry[],
		}));
		setIsLoadingBoards(false);
	}, [lists]);

	useEffect(() => {
		if (!lists.workspaces) return;
		setFilteredLists((prev) => ({
			...prev,
			workspaces: lists.workspaces as IHomeWorkspaceEntry[],
		}));
		setIsLoadingWorkspaces(false);
	}, [lists]);

	//filter out entries based on search inputs
	useEffect(() => {
		const filterBoards = (input: string, entries: IHomeBoardEntry[]) => {
			return entries.filter(
				(entry) =>
					entry.name
						.trim()
						.toLowerCase()
						.includes(input.trim().toLowerCase()) ||
					entry.workspaceName
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
				boards: filterBoards(
					searchInputs.searchBoards,
					lists.boards || []
				),
				workspaces: filterWorkspaces(
					searchInputs.searchWorkspaces,
					lists.workspaces || []
				),
			};
		});
	}, [searchInputs]);

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
			searchInputs,
			filteredLists,
			isLoadingBoards,
			isLoadingWorkspaces,
		},
		operations: {
			handleFilterInputChange,
		},
	};
};
