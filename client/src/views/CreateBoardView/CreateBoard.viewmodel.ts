import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { extractTokens, isAccessTokenValid, refreshTokens } from '@/utils';

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
	boardData: IBoardData | null;
	workspaceData: IWorkspace | null;
	accessibleWorkspaces: IWorkspace[];
}

interface ICreateBoardViewModelOperations {
	createBoard(): void;
	chooseWorkspace(workspaceData: IWorkspace): void;
	handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export interface IWorkspace {
	id: number;
	name: string;
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
	const [accessibleWorkspaces, setAccessibleWorkspaces] = useState<
		IWorkspace[]
	>([]);

	useEffect(() => {
		const { accessToken } = extractTokens();
		if (!isAccessTokenValid(accessToken)) {
			refreshTokens();
		}

		fetch(`${import.meta.env.VITE_SERVER_URL}/workspaces`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setAccessibleWorkspaces(data as IWorkspace[]);
			})
			.catch((err) => {
				console.log(err.message);
			});
	}, []);

	const createBoard = async () => {
		try {
			const { accessToken } = extractTokens();
			if (!isAccessTokenValid(accessToken)) {
				refreshTokens();
			}
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/boards/create`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer: ${accessToken}`,
					},
					body: JSON.stringify({
						name: inputFields.boardName,
						workspaceId: 1,
					}),
				}
			);
			const data = await res.json();
			setBoardData(data);

			openBoardView(data.id);
		} catch (err: any) {
			console.log(err.message);
			setErrorMessage(err.message);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputFields((prevInputFields) => ({
			...prevInputFields,
			[name]: value,
		}));
	};

	const chooseWorkspace = (workspaceData: IWorkspace) => {
		setInputFields((prev) => ({
			...prev,
			workspaceName: workspaceData.name,
		}));
		setWorkspaceData(workspaceData);
	};

	const openBoardView = (boardId: string) => {
		navigate(`/boards/details/${boardId}`);
	};

	return {
		state: {
			boardData,
			inputFields,
			errorMessage,
			workspaceData,
			accessibleWorkspaces,
		},
		operations: {
			createBoard,
			chooseWorkspace,
			handleInputChange,
		},
	};
};
