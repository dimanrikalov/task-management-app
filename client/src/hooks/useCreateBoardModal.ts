import {
	request,
	METHODS,
	BOARD_ENDPOINTS,
	WORKSPACE_ENDPOINTS
} from '../utils/requester';
import { ROUTES } from '../router';
import { generateImgUrl } from '@/utils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { languages, useTranslate } from './useTranslate';
import { useErrorContext } from '../contexts/error.context';
import { useModalsContext } from '../contexts/modals.context';
import { IDetailedWorkspace } from '../contexts/workspace.context';
import { IUser } from '../components/AddColleagueInput/AddColleagueInput';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';
import { useSelectedWorkspaceContext } from '../contexts/selectedWorkspace.context';

export enum INPUT_STATES_KEYS {
	BOARD_NAME = 'boardName',
	WORKSPACE_NAME = 'workspaceName'
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

export const useCreateBoardModal = () => {
	const navigate = useNavigate();
	const { language } = useTranslate();
	const { showError } = useErrorContext();
	const { toggleModal } = useModalsContext();
	const { workspaceName } = useSelectedWorkspaceContext();
	const [boardColleagues, setBoardColleagues] = useState<IUser[]>([]);
	const { data: userData, accessToken } =
		useUserContext() as IUserContextSecure;
	const [isWorkspaceNameInputDisabled, setIsWorkspaceNameInputDisabled] =
		useState<boolean>(false);
	const [selectedWorkspace, setSelectedWorkspace] =
		useState<IDetailedWorkspace | null>(null);
	const [inputValues, setInputValues] = useState<IInputStates>({
		[INPUT_STATES_KEYS.BOARD_NAME]: '',
		[INPUT_STATES_KEYS.WORKSPACE_NAME]: ''
	});
	const [workspacesData, setWorkspacesData] = useState<IDetailedWorkspace[]>(
		[]
	);

	useEffect(() => {
		if (!workspaceName) return;
		setInputValues((prev) => ({
			...prev,
			workspaceName
		}));
		setIsWorkspaceNameInputDisabled(true);
	}, [workspaceName]);

	useEffect(() => {
		const fetchWorkspaces = async () => {
			try {
				//get only the workspaces to which the user has access to
				const workspaces = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: WORKSPACE_ENDPOINTS.BASE
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
					endpoint: WORKSPACE_ENDPOINTS.DETAILS(matchingWorkspace.id)
				})) as IDetailedWorkspace;

				//add workspace owner to the users with access to the workspace, and filter out the currently logged user
				const workspaceUsers = [
					detailedWorkspace.workspaceOwner,
					...detailedWorkspace.workspaceUsers
				]
					.filter((user) => user.id !== userData.id)
					.map((user) => ({
						...user,
						profileImagePath: generateImgUrl(user.profileImagePath)
					}));

				/* 
					add the currently logged user as 'Me' on top of the list
					and directly give the profileImagePath as we have it loaded from the authGuard
				*/
				const Me = language === languages.en ? 'Me' : 'Аз';
				workspaceUsers.unshift({
					username: Me,
					id: userData.id,
					email: userData.email,
					profileImagePath: userData.profileImagePath
				});

				detailedWorkspace.workspaceUsers = workspaceUsers;

				setSelectedWorkspace(detailedWorkspace);
			} catch (err: any) {
				console.log(err.message);
				setSelectedWorkspace(null);
				showError(err.message);
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
			[e.target.name]: e.target.value
		}));
	};

	const createBoard = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!selectedWorkspace) {
			showError('Workspace is required!');
			return;
		}

		if (!inputValues.boardName) {
			showError('Board name is required!');
			return;
		}

		if (inputValues.boardName.length < 2) {
			showError('Board name must be at least 2 characters long!');
			return;
		}

		try {
			const body = {
				name: inputValues.boardName,
				workspaceId: selectedWorkspace.id,
				colleagues: boardColleagues
					.map((colleague) => colleague.id)
					.filter((colleagueId) => colleagueId !== userData.id)
			};

			const data = await request({
				body,
				accessToken,
				method: METHODS.POST,
				endpoint: BOARD_ENDPOINTS.BASE
			});

			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			toggleModal('showCreateBoardModal');
			navigate(ROUTES.BOARD(data.boardId));
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	};

	const addBoardColleague = (colleague: IUser) => {
		setBoardColleagues((prev) => [...prev, colleague]);
	};

	const removeBoardColleague = (colleague: IUser) => {
		setBoardColleagues((prev) => [
			...prev.filter((col) => col.id !== colleague.id)
		]);
	};

	const selectWorkspace = (workspace: IDetailedWorkspace) => {
		setInputValues((prev) => ({ ...prev, workspaceName: workspace.name }));
	};

	const toggleIsCreateBoardModalOpen = () => {
		toggleModal('showCreateBoardModal');
	};

	return {
		inputValues,
		createBoard,
		workspacesData,
		boardColleagues,
		selectWorkspace,
		handleInputChange,
		selectedWorkspace,
		addBoardColleague,
		removeBoardColleague,
		isWorkspaceNameInputDisabled,
		toggleIsCreateBoardModalOpen
	};
};
