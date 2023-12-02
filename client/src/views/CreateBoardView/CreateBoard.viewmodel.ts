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
	ownerId: number;
	workspaceUsers: IUser[];
	boards: IDetailedBoard[];
}

interface ICreateBoardViewModelState {
	errorMessage: string;
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
}

export const useCreateBoardViewModel = (): ViewModelReturnType<
	ICreateBoardViewModelState,
	ICreateBoardViewModelOperations
> => {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState<string>('');
	const { accessToken, userData } = useOutletContext<IOutletContext>();
	const [workspacesData, setWorkspacesData] = useState<IDetailedWorkspace[]>(
		[]
	);
	const [selectedWorkspace, setSelectedWorkspace] =
		useState<IDetailedWorkspace | null>(null);
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

				if (matchingWorkspace) {
					const getSelectedWorkspaceDetails =
						async (): Promise<IDetailedWorkspace> => {
							const res = await fetch(
								`${
									import.meta.env.VITE_SERVER_URL
								}/workspaces/${matchingWorkspace.id}/details`,
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

					const detailedWorkspace =
						await getSelectedWorkspaceDetails();
					setSelectedWorkspace({
						...detailedWorkspace,
						workspaceUsers: [
							...detailedWorkspace.workspaceUsers,
							{
								id: userData.id,
								email: userData.email,
								profileImagePath: userData.profileImagePath,
							},
						],
					});
					return;
				}
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
		if (!selectedWorkspace) return;

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
						colleagues: selectedWorkspace.workspaceUsers
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
		setSelectedWorkspace((prev) => ({
			...prev!,
			workspaceUsers: [...prev!.workspaceUsers, colleague],
		}));
	};

	const removeBoardColleague = (colleague: IUser) => {
		setSelectedWorkspace((prev) => ({
			...prev!,
			workspaceUsers: [
				...prev!.workspaceUsers.filter(
					(user) => user.id !== colleague.id
				),
			],
		}));
	};

	const selectWorkspace = (workspace: IDetailedWorkspace) => {
		setInputValues((prev) => ({ ...prev, workspaceName: workspace.name }));
	};

	return {
		state: {
			inputValues,
			errorMessage,
			workspacesData,
			selectedWorkspace,
		},
		operations: {
			createBoard,
			selectWorkspace,
			handleInputChange,
			addBoardColleague,
			removeBoardColleague,
		},
	};
};
