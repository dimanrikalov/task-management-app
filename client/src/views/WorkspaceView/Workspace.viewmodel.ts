import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { extractTokens, isAccessTokenValid, refreshTokens } from '@/utils';
import { IDetailedWorkspace } from '../CreateBoardView/CreateBoard.viewmodel';

interface IWorkspaceViewModelState {
	inputValue: string;
	createBoardModalIsOpen: boolean;
	editColleaguesModalIsOpen: boolean;
	deleteWorkspaceModalIsOpen: boolean;
	workspaceData: IDetailedWorkspace | null;
}

interface IWorkspaceViewModelOperations {
	backBtnHandler(): void;
	toggleCreateBoardModalIsOpen(): void;
	toggleEditcolleaguesModalIsOpen(): void;
	toggleDeleteWorkspaceModalIsOpen(): void;
	addWorkspaceColleague(colleagueId: number): void;
	removeWorkspaceColleague(colleagueId: number): void;
	inputChangeHandler(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useWorkspaceViewModel = (): ViewModelReturnType<
	IWorkspaceViewModelState,
	IWorkspaceViewModelOperations
> => {
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');
	const [editColleaguesModalIsOpen, setEditColleaguesModalIsOpen] =
		useState(false);
	const [deleteWorkspaceModalIsOpen, setDeleteWorkspaceModalIsOpen] =
		useState(false);
	const [createBoardModalIsOpen, setCreateBoardModalIsOpen] = useState(false);
	const { pathname } = useLocation();
	const workspaceId = pathname.split('/').pop();
	const [workspaceData, setWorkspaceData] =
		useState<IDetailedWorkspace | null>(null);
	const [refreshWorkspace, setRefreshWorkspace] = useState(true);
	const { accessToken } = extractTokens();
	if (!isAccessTokenValid(accessToken)) {
		refreshTokens();
	}

	useEffect(() => {
		if (refreshWorkspace) {
			fetch(
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
			)
				.then((res) => res.json())
				.then((data) => {
					setWorkspaceData(data);
					setRefreshWorkspace(false);
				});
		}
	}, [refreshWorkspace]);

	const backBtnHandler = () => {
		navigate('/dashboard');
	};

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const toggleCreateBoardModalIsOpen = () => {
		setCreateBoardModalIsOpen((prev) => !prev);
	};

	const toggleEditcolleaguesModalIsOpen = () => {
		setEditColleaguesModalIsOpen((prev) => !prev);
	};

	const toggleDeleteWorkspaceModalIsOpen = () => {
		setDeleteWorkspaceModalIsOpen((prev) => !prev);
	};

	const addWorkspaceColleague = async (colleagueId: number) => {
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
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						colleagueId,
					}),
				}
			);

			// Set refreshWorkspace to true to trigger a re-fetch of the workspace details
			setRefreshWorkspace(true);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	const removeWorkspaceColleague = async (colleagueId: number) => {
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
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify({
						colleagueId,
					}),
				}
			);

			setRefreshWorkspace(true);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	return {
		state: {
			inputValue,
			workspaceData,
			createBoardModalIsOpen,
			editColleaguesModalIsOpen,
			deleteWorkspaceModalIsOpen,
		},
		operations: {
			backBtnHandler,
			inputChangeHandler,
			addWorkspaceColleague,
			removeWorkspaceColleague,
			toggleCreateBoardModalIsOpen,
			toggleEditcolleaguesModalIsOpen,
			toggleDeleteWorkspaceModalIsOpen,
		},
	};
};
