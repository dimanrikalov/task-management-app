import {
	request,
	METHODS,
	BOARD_ENDPOINTS,
	WORKSPACE_ENDPOINTS,
} from '@/utils/requester';
import { ROUTES } from '@/router';
import { IOutletContext } from '@/guards/authGuard';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ErrorContext, IErrorContext } from '@/contexts/ErrorContext';
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

export interface IDetailedBoard {
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
	const { setErrorMessage } = useContext<IErrorContext>(ErrorContext);
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
				//get only the workspaces to which the user has access to
				const workspaces = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: WORKSPACE_ENDPOINTS.BASE,
				})) as IDetailedWorkspace[];

				setWorkspacesData(workspaces);

				//filter out all that don't match the user input
				const matchingWorkspace = workspaces.find(
					(workspace) =>
						workspace.name.trim().toLowerCase() ===
						inputValues.workspaceName.trim().toLowerCase()
				);

				if (!matchingWorkspace) {
					setSelectedWorkspace(null);
					return;
				}

				// if there is a match fetch the details for the workspace
				const detailedWorkspace = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: WORKSPACE_ENDPOINTS.DETAILS(matchingWorkspace.id),
				})) as IDetailedWorkspace;

				//add workspace owner to the users with access to the workspace, and filter out the currently logged user
				const workspaceUsers = [
					detailedWorkspace.workspaceOwner,
					...detailedWorkspace.workspaceUsers,
				]
					.filter((user) => user.id !== userData.id)
					.map((user) => ({
						...user,
						profileImagePath: `data:image/png;base64,${user.profileImagePath}`,
					}));

				/* 
					add the currently logged user as 'Me' on top of the list
					and directly give the profileImagePath as we have it loaded from the authGuard
				*/

				workspaceUsers.unshift({
					email: 'Me',
					id: userData.id,
					profileImagePath: userData.profileImagePath,
				});

				detailedWorkspace.workspaceUsers = workspaceUsers;

				setSelectedWorkspace(detailedWorkspace);
			} catch (err: any) {
				console.log(err.message);
				setSelectedWorkspace(null);
				setErrorMessage(err.message);
			}
		};

		const timeout = setTimeout(() => {
			fetchWorkspaces();
		}, 100);

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
			const body = {
				name: inputValues.boardName,
				workspaceId: selectedWorkspace.id,
				colleagues: boardColleagues
					.map((colleague) => colleague.id)
					.filter((colleagueId) => colleagueId !== userData.id),
			};

			const data = await request({
				body,
				accessToken,
				method: METHODS.POST,
				endpoint: BOARD_ENDPOINTS.BASE,
			});

			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			navigate(ROUTES.BOARD(data.boardId));
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
