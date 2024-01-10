import { useState } from 'react';
import { ROUTES } from '../router';
import { useNavigate } from 'react-router-dom';
import { useErrorContext } from '../contexts/error.context';
import { useModalsContext } from '../contexts/modals.context';
import { useWorkspaceContext } from '../contexts/workspace.context';
import { METHODS, WORKSPACE_ENDPOINTS, request } from '../utils/requester';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';
import { useSelectedWorkspaceContext } from '../contexts/selectedWorkspace.context';

export const useEditWorkspace = () => {
	const navigate = useNavigate();
	const { showError } = useErrorContext();
	const { toggleModal } = useModalsContext();
	const { setWorkspaceName } = useSelectedWorkspaceContext();
	const { accessToken } = useUserContext() as IUserContextSecure;
	const { workspaceData, setWorkspaceData } = useWorkspaceContext();
	const [isInputModeOn, setIsInputModeOn] = useState<boolean>(false);
	const [workspaceNameInput, setWorkspaceNameInput] = useState<string>('');
	const toggleIsCreateBoardModalOpen = () => {
		if (!workspaceData) return;
		toggleModal('showCreateBoardModal');
		setWorkspaceName(workspaceData.name);
	};

	const handleWorkspaceNameInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setWorkspaceNameInput(e.target.value);
	};

	const handleWorkspaceNameChange = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		if (!workspaceData) return;

		if (workspaceData.name === workspaceNameInput) {
			setIsInputModeOn(false);
			return;
		}

		try {
			const data = await request({
				accessToken,
				method: METHODS.PUT,
				endpoint: WORKSPACE_ENDPOINTS.RENAME(workspaceData.id),
				body: {
					newName: workspaceNameInput.trim(),
				},
			});

			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			setWorkspaceData((prev) => {
				if (!prev) return null;

				return {
					...prev,
					name: workspaceNameInput,
				};
			});
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
		setIsInputModeOn(false);
	};

	const deleteWorkspace = async () => {
		if (!workspaceData) {
			throw new Error('Workspace data missing!');
		}
		try {
			await request({
				accessToken,
				method: METHODS.DELETE,
				endpoint: WORKSPACE_ENDPOINTS.WORKSPACE(workspaceData.id),
			});
			navigate(ROUTES.DASHBOARD, { replace: true });
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	};

	const toggleIsInputModeOn = () => {
		if (!workspaceData) return;
		setIsInputModeOn((prev) => !prev);
		setWorkspaceNameInput(workspaceData.name);
	};

	return {
		isInputModeOn,
		deleteWorkspace,
		workspaceNameInput,
		toggleIsInputModeOn,
		handleWorkspaceNameChange,
		toggleIsCreateBoardModalOpen,
		handleWorkspaceNameInputChange,
	};
};
