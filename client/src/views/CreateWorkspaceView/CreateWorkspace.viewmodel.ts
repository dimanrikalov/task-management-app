import { ROUTES } from '@/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IOutletContext } from '@/guards/authGuard';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { METHODS, WORKSPACE_ENDPOINTS, request } from '@/utils/requester';

interface ICreateWorkspaceState {
	userData: IUser;
	inputValue: string;
	colleagues: IUser[];
}

interface ICreateWorkspaceOperations {
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
	const { userData } = useOutletContext<IOutletContext>();
	const { accessToken } = useOutletContext<IOutletContext>();
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

			if (data.statusCode === 400) {
				if (data.message.length) {
					throw new Error(data.message[0]);
				}
			}

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
		},
	};
};
