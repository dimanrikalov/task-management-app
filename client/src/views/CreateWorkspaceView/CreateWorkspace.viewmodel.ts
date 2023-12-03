import { useState } from 'react';
import { IOutletContext } from '@/guards/authGuard';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

interface ICreateWorkspaceState {
	userData: IUser;
	inputValue: string;
	colleagues: IUser[];
	errorMessage: string;
}

interface ICreateWorkspaceOperations {
	goToWorkspace(workspaceId: string): void;
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
	const [inputValue, setInputValue] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
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
			setErrorMessage('A workspace name is required!');
			return;
		}

		if (inputValue.length < 4) {
			setErrorMessage(
				'Workspace name must be at least 4 characters long!'
			);
		}

		try {
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/workspaces`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
					credentials: 'include', // Include credentials (cookies) in the request
					body: JSON.stringify({
						name: inputValue,
						colleagues: colleagues
							.map((colleague) => colleague.id)
							.filter(
								(colleagueId) => colleagueId !== userData.id
							),
					}),
				}
			);

			const data = await res.json();
			if (data.statusCode === 400) {
				if (data.message.length) {
					throw new Error(data.message[0]);
				}
			}

			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			goToWorkspace(data.workspaceId);
		} catch (err: any) {
			console.log(err.message);
			setErrorMessage(err.message);
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

	const goToWorkspace = (workspaceId: string) => {
		navigate(`/workspaces/${workspaceId}`);
	};

	return {
		state: {
			userData,
			inputValue,
			colleagues,
			errorMessage,
		},
		operations: {
			goToWorkspace,
			createWorkspace,
			handleInputChange,
			addToColleaguesToAdd,
			removeFromColleaguesToAdd,
		},
	};
};
