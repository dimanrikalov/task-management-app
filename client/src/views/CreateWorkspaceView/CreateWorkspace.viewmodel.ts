import { useState } from 'react';
import { ROUTES } from '@/router';
import { useDispatch } from 'react-redux';
import { IUserData } from '@/app/userSlice';
import { useAppSelector } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { toggleCreateWorkspaceModal } from '@/app/modalsSlice';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { METHODS, WORKSPACE_ENDPOINTS, request } from '@/utils/requester';

interface ICreateWorkspaceState {
	userData: IUser;
	inputValue: string;
	colleagues: IUser[];
}

interface ICreateWorkspaceOperations {
	toggleIsCreateWorkspaceModalOpen(): void;
	addToColleaguesToAdd(colleague: IUser): void;
	removeFromColleaguesToAdd(colleague: IUser): void;
	createWorkspace(e: React.FormEvent<HTMLFormElement>): void;
	handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useCreateWorkspaceViewModel = (): ViewModelReturnType<
	ICreateWorkspaceState,
	ICreateWorkspaceOperations
> => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [inputValue, setInputValue] = useState('');
	const { data: userData, accessToken } = useAppSelector(
		(state) => state.user
	) as { data: IUserData; accessToken: string };
	const [colleagues, setColleagues] = useState<IUser[]>([
		{ ...userData, email: 'Me' },
	]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const createWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!inputValue) {
			dispatch(setErrorMessageAsync('A workspace name is required!'));
			return;
		}

		if (inputValue.length < 4) {
			dispatch(
				setErrorMessageAsync(
					'Workspace name must be at least 4 characters long!'
				)
			);
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

			navigate(ROUTES.WORKSPACE(data.workspaceId));
		} catch (err: any) {
			console.log(err.message);
			dispatch(setErrorMessageAsync(err.message));
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
		dispatch(toggleCreateWorkspaceModal());
	};

	return {
		state: {
			userData,
			inputValue,
			colleagues,
		},
		operations: {
			createWorkspace,
			handleInputChange,
			addToColleaguesToAdd,
			removeFromColleaguesToAdd,
			toggleIsCreateWorkspaceModalOpen,
		},
	};
};
