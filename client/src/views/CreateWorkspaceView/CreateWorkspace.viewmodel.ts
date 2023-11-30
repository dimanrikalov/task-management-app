import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { extractTokens, isAccessTokenValid, refreshTokens } from '@/utils';

interface ICreateWorkspaceState {
	inputValue: string;
	errorMessage: string;
	colleagueIds: number[];
}

interface ICreateWorkspaceOperations {
	goToWorkspace(workspaceId: string): void;
	addToColleaguesToAdd(colleagueId: number): void;
	removeFromColleaguesToAdd(colleagueId: number): void;
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
	const [colleagueIds, setColleagueIds] = useState<number[]>([]);
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
		const { accessToken } = extractTokens();
		if (!isAccessTokenValid(accessToken)) {
			refreshTokens();
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
						colleagues: colleagueIds,
					}),
				}
			);

			const data = await res.json();
			if (data.statusCode === 400) {
				if (data.message.length) {
					throw new Error(data.message[0]);
				}
			}
			console.log(data);
			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			goToWorkspace(data.workspaceId);
		} catch (err: any) {
			console.log(err.message);
			setErrorMessage(err.message);
		}
	};

	const addToColleaguesToAdd = (colleagueId: number) => {
		setColleagueIds((prev) => [...prev, colleagueId]);
	};

	const removeFromColleaguesToAdd = (colleagueId: number) => {
		setColleagueIds((prev) => [
			...prev.filter((colId) => colId !== colleagueId),
		]);
	};

	const goToWorkspace = (workspaceId: string) => {
		navigate(`/workspaces/${workspaceId}`);
	};

	return {
		state: {
			inputValue,
			colleagueIds,
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
