import {
	ILists,
	IHomeBoardEntry,
	useFetchHomeLists,
	IHomeWorkspaceEntry,
} from '@/hooks/useFetchHomeLists';
import { ROUTES } from '@/router';
import { deleteTokens } from '@/utils';
import { useState, useEffect } from 'react';
import { IUserData } from '@/app/userSlice';
import { useAppSelector } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';
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
	const { lists, isLoading } = useFetchHomeLists();
	const date = new Date().toLocaleDateString('en-US', options);
	const [filteredLists, setFilteredLists] = useState<ILists>({
		boards: [],
		workspaces: [],
	});
	const [searchInputs, setSearchInputs] = useState<ISearchInputs>({
		searchBoards: '',
		searchWorkspaces: '',
	});
	const { data: userData } = useAppSelector((state) => state.user) as {
		data: IUserData;
	};

	useEffect(() => {
		setFilteredLists(() => ({
			boards: [...lists.boards],
			workspaces: [...lists.workspaces],
		}));
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
