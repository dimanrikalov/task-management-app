import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface ICreateWorkspaceState {
	inputValue: string;
}

interface ICreateWorkspaceOperations {
	goToWorkspace(): void;
	handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useCreateWorkspaceViewModel = (): ViewModelReturnType<
	ICreateWorkspaceState,
	ICreateWorkspaceOperations
> => {
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const goToWorkspace = () => {
		navigate('/workspace');
	};

	return {
		state: {
			inputValue,
		},
		operations: { handleInputChange, goToWorkspace },
	};
};
