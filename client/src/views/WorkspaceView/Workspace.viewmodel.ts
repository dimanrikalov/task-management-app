import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { extractTokens, isAccessTokenValid, refreshTokens } from '@/utils';

interface IWorkspaceData {
	id: number;
	name: string;
	ownerId: number;
	boards: any[];
}

interface IWorkspaceViewModelState {
	inputValue: string;
	createBoardModalIsOpen: boolean;
	editColleaguesModalIsOpen: boolean;
	deleteWorkspaceModalIsOpen: boolean;
	workspaceData: IWorkspaceData | null;
}

interface IWorkspaceViewModelOperations {
	backBtnHandler(): void;
	toggleCreateBoardModalIsOpen(): void;
	toggleEditcolleaguesModalIsOpen(): void;
	toggleDeleteWorkspaceModalIsOpen(): void;
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
	const [workspaceData, setWorkspaceData] = useState(null);
	useEffect(() => {
		const { accessToken } = extractTokens();
		if (!isAccessTokenValid(accessToken)) {
			refreshTokens();
		}

		fetch(`${import.meta.env.VITE_SERVER_URL}/workspaces/details`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Make sure to set the content type if you're sending JSON
				Authorization: `Bearer ${accessToken}`,
				// Add any other headers if needed
			},
			body: JSON.stringify({
				workspaceId,
			}),
		})
			.then((res) => res.json())
			.then((data) => setWorkspaceData(data));
	}, []);

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
			toggleCreateBoardModalIsOpen,
			toggleEditcolleaguesModalIsOpen,
			toggleDeleteWorkspaceModalIsOpen,
		},
	};
};
