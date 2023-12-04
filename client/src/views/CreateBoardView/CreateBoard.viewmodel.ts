import { useState, useEffect } from 'react';
import { IOutletContext } from '@/guards/authGuard';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

export enum INPUT_STATES_KEYS {
	BOARD_NAME = 'boardName',
	WORKSPACE_NAME = 'workspaceName',
}

type IInputStates = {
	[key in INPUT_STATES_KEYS]: string;
};

export interface IWorkspace {
	id: number;
	name: string;
}

interface IDetailedBoard {
	id: number;
	name: string;
	workspaceId: number;
}

export interface IDetailedWorkspace {
	id: number;
	name: string;
	workspaceOwner: IUser;
	workspaceUsers: IUser[];
	boards: IDetailedBoard[];
}

interface ICreateBoardViewModelState {
	errorMessage: string;
	boardColleagues: IUser[];
	inputValues: IInputStates;
	workspacesData: IDetailedWorkspace[];
	selectedWorkspace: IDetailedWorkspace | null;
}

interface ICreateBoardViewModelOperations {
	addBoardColleague(colleague: IUser): void;
	removeBoardColleague(colleague: IUser): void;
	selectWorkspace(workspace: IDetailedWorkspace): void;
	createBoard(e: React.FormEvent<HTMLFormElement>): void;
	handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
	setInputValues: React.Dispatch<React.SetStateAction<IInputStates>>;
}

export const useCreateBoardViewModel = (): ViewModelReturnType<
	ICreateBoardViewModelState,
	ICreateBoardViewModelOperations
> => {
	const navigate = useNavigate();
	const [selectedWorkspace, setSelectedWorkspace] =
		useState<IDetailedWorkspace | null>(null);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [boardColleagues, setBoardColleagues] = useState<IUser[]>([]);
	const { accessToken, userData } = useOutletContext<IOutletContext>();
	const [workspacesData, setWorkspacesData] = useState<IDetailedWorkspace[]>(
		[]
	);
	const [inputValues, setInputValues] = useState<IInputStates>({
		[INPUT_STATES_KEYS.BOARD_NAME]: '',
		[INPUT_STATES_KEYS.WORKSPACE_NAME]: '',
	});

	useEffect(() => {
		const fetchWorkspaces = async () => {
			try {
				const res = await fetch(
					`${import.meta.env.VITE_SERVER_URL}/workspaces`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				const workspaces = (await res.json()) as IDetailedWorkspace[];
				setWorkspacesData(workspaces);

				const matchingWorkspace = workspaces.find(
					(workspace) =>
						workspace.name.trim().toLowerCase() ===
						inputValues.workspaceName.trim().toLowerCase()
				);

				if (!matchingWorkspace) {
					setSelectedWorkspace(null);
					return;
				}

				const getSelectedWorkspaceDetails =
					async (): Promise<IDetailedWorkspace> => {
						const res = await fetch(
							`${import.meta.env.VITE_SERVER_URL}/workspaces/${
								matchingWorkspace.id
							}/details`,
							{
								method: 'GET',
								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${accessToken}`,
								},
							}
						);
						return (await res.json()) as IDetailedWorkspace;
					};

				const data = await getSelectedWorkspaceDetails();

				let workspaceUsers = [
					data.workspaceOwner,
					...data.workspaceUsers,
				];

				workspaceUsers = workspaceUsers.filter(
					(user) => user.id !== userData.id
				);

				workspaceUsers.unshift({
					email: 'Me',
					id: userData.id,
					profileImagePath: userData.profileImagePath,
				});

				setSelectedWorkspace({
					...data,
					workspaceUsers,
				});

				return;
			} catch (err: any) {
				console.log(err.message);
			}
			setSelectedWorkspace(null);
		};

		const timeout = setTimeout(() => {
			fetchWorkspaces();
		}, 300);

		return () => clearTimeout(timeout);
	}, [inputValues]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValues((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const createBoard = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(selectedWorkspace);
		setErrorMessage('');
		if (!selectedWorkspace) {
			setErrorMessage('Workspace is required!');
			return;
		}

		if (!inputValues.boardName) {
			setErrorMessage('Board name is required!');
			return;
		}

		if (inputValues.boardName.length < 2) {
			setErrorMessage('Board name must be at least 2 characters long!');
			return;
		}

		try {
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/boards`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: inputValues.boardName,
						workspaceId: selectedWorkspace.id,
						colleagues: boardColleagues
							.map((colleague) => colleague.id)
							.filter(
								(colleagueId) => colleagueId !== userData.id
							),
					}),
				}
			);
			const data = await res.json();
			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			navigate(`/boards/${data.boardId}`);
		} catch (err: any) {
			console.log(err.message);
			setErrorMessage(err.message);
		}
	};

	const addBoardColleague = (colleague: IUser) => {
		setBoardColleagues((prev) => [...prev, colleague]);
	};

	const removeBoardColleague = (colleague: IUser) => {
		setBoardColleagues((prev) => [
			...prev.filter((col) => col.id !== colleague.id),
		]);
	};

	const selectWorkspace = (workspace: IDetailedWorkspace) => {
		setInputValues((prev) => ({ ...prev, workspaceName: workspace.name }));
	};

	return {
		state: {
			inputValues,
			errorMessage,
			workspacesData,
			boardColleagues,
			selectedWorkspace,
		},
		operations: {
			createBoard,
			setInputValues,
			selectWorkspace,
			handleInputChange,
			addBoardColleague,
			removeBoardColleague,
		},
	};
};
