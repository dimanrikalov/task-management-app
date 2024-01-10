import { useState } from 'react';
import { ROUTES } from '../router';
import { useNavigate } from 'react-router-dom';
import { useErrorContext } from '../contexts/error.context';
import { useModalsContext } from '../contexts/modals.context';
import { IUser } from '../components/AddColleagueInput/AddColleagueInput';
import { METHODS, WORKSPACE_ENDPOINTS, request } from '../utils/requester';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';

export const useCreateWorkspaceModal = () => {
	const navigate = useNavigate();
	const { showError } = useErrorContext();
	const { toggleModal } = useModalsContext();
	const [inputValue, setInputValue] = useState('');
	const { data: userData, accessToken } =
		useUserContext() as IUserContextSecure;
	const [colleagues, setColleagues] = useState<IUser[]>([
		{ ...userData, email: 'Me' },
	]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const createWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!inputValue) {
			showError('A workspace name is required!');
			return;
		}

		if (inputValue.length < 4) {
			showError('Workspace name must be at least 4 characters long!');
		}

		try {
			const body = {
				name: inputValue,
				colleagues: colleagues
					.map((colleague) => colleague.id)
					.filter((colleagueId) => colleagueId !== userData.id),
			};

			const data = await request({
				body,
				accessToken,
				method: METHODS.POST,
				endpoint: WORKSPACE_ENDPOINTS.BASE,
			});

			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			toggleModal('showCreateWorkspaceModal');
			navigate(ROUTES.WORKSPACE(data.workspaceId));
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	};

	const addToColleaguesToAdd = (colleague: IUser) => {
		setColleagues((prev) => [...prev, colleague]);
	};

	const removeFromColleaguesToAdd = (colleague: IUser) => {
		setColleagues((prev) => [
			...prev.filter((col) => col.id !== colleague.id),
		]);
	};

	const toggleIsCreateWorkspaceModalOpen = () => {
		toggleModal('showCreateWorkspaceModal');
	};

	return {
		userData,
		inputValue,
		colleagues,
		createWorkspace,
		handleInputChange,
		addToColleaguesToAdd,
		removeFromColleaguesToAdd,
		toggleIsCreateWorkspaceModalOpen,
	};
};
