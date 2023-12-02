import { useState, useEffect } from 'react';
import { IOutletContext } from '@/guards/authGuard';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

interface IBoardData {
	id: number;
}
interface IInputFields {
	boardName: string;
	workspaceName: string;
}
interface ICreateBoardViewModelState {
	errorMessage: string;
	inputFields: IInputFields;
	colleagueIds: number[];
	disableDeletionFor: number[];
	boardData: IBoardData | null;
	accessibleWorkspaces: IWorkspace[];
	workspaceDetailedData: IDetailedWorkspace | null;
}

interface ICreateBoardViewModelOperations {
	chooseWorkspace(workspaceData: IWorkspace): void;
	addWorkspaceColleague(colleagueId: number): void;
	removeWorkspaceColleague(colleagueId: number): void;
	createBoard(e: React.FormEvent<HTMLFormElement>): void;
	handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

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

export const useCreateBoardViewModel = (): ViewModelReturnType<
	ICreateBoardViewModelState,
	ICreateBoardViewModelOperations
> => {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState('');
	const [boardData, setBoardData] = useState<IBoardData | null>(null);
	const [inputFields, setInputFields] = useState<IInputFields>({
		boardName: '',
		workspaceName: '',
	});
	const [workspaceData, setWorkspaceData] = useState<IWorkspace | null>(null);
	const [workspaceDetailedData, setWorkspaceDetailedData] =
		useState<IDetailedWorkspace | null>(null);
	const [accessibleWorkspaces, setAccessibleWorkspaces] = useState<
		IWorkspace[]
	>([]);
	const { accessToken } = useOutletContext<IOutletContext>();
	const [colleagueIds, setColleagueIds] = useState<number[]>([]);
	const [disableDeletionFor, setDisableDeletionFor] = useState<number[]>([]);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_SERVER_URL}/workspaces`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setAccessibleWorkspaces(data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	}, []);

	useEffect(() => {
		//upon selecting a workspace we need to check all users with access to the chosen workspace
		if (workspaceData) {
			fetch(
				`${import.meta.env.VITE_SERVER_URL}/workspaces/${
					workspaceData.id
				}/details`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)
				.then((res) => res.json())
				.then((data) => {
					console.log('WORKSPACE DATA', data);
					setWorkspaceDetailedData(data);
					setColleagueIds([
						...data.workspaceUserIds.map(
							(entry: any) => entry.userId
						),
					]);
					setDisableDeletionFor([
						...data.workspaceUserIds.map((x: any) => x.userId),
					]);
				})
				.catch((err) => {
					console.log(err.message);
				});
		}
	}, [workspaceData]);

	const createBoard = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!inputFields.boardName) {
			setErrorMessage('Board name is required!');
			return;
		}
		try {
			if (!workspaceData) {
				throw new Error('Invalid Workspace ID!');
			}
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/boards`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
					credentials: 'include', // Include credentials (cookies) in the request
					body: JSON.stringify({
						name: inputFields.boardName,
						workspaceId: workspaceData?.id,
						colleagues: colleagueIds,
					}),
				}
			);
			const data = await res.json();
			setBoardData(data);
			console.log(data);

			openBoardView(data.boardId);
		} catch (err: any) {
			console.log(err.message);
			setErrorMessage(err.message);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setWorkspaceDetailedData(null);
		setInputFields((prevInputFields) => {
			if (name === 'workspaceName') {
				setWorkspaceData(() => {
					const validWorkspace = accessibleWorkspaces.find(
						(workspace) => workspace.name === value
					);
					if (validWorkspace) {
						return validWorkspace;
					}
					return null;
				});
			}

			return {
				...prevInputFields,
				[name]: value,
			};
		});
	};

	const openBoardView = (boardId: string) => {
		navigate(`/boards/${boardId}`);
	};

	const chooseWorkspace = (workspaceData: IWorkspace) => {
		setInputFields((prev) => ({
			...prev,
			workspaceName: workspaceData.name,
		}));
		setWorkspaceData(workspaceData);
	};

	const addWorkspaceColleague = async (colleagueId: number) => {
		setColleagueIds((prev) => [...prev, colleagueId]);
	};

	const removeWorkspaceColleague = (colleagueId: number) => {
		setColleagueIds((prev) => [
			...prev.filter((colId) => colId !== colleagueId),
		]);
	};

	return {
		state: {
			boardData,
			inputFields,
			errorMessage,
			colleagueIds,
			disableDeletionFor,
			workspaceDetailedData,
			accessibleWorkspaces,
		},
		operations: {
			createBoard,
			chooseWorkspace,
			handleInputChange,
			addWorkspaceColleague,
			removeWorkspaceColleague,
		},
	};
};
