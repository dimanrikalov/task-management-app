import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { useState } from 'react';

interface ICreateWorkspaceState {
	inputValue: string;
}

interface ICreateWorkspaceOperations {
	handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useCreateWorkspaceViewModel = (): ViewModelReturnType<
	ICreateWorkspaceState,
	ICreateWorkspaceOperations
> => {
	const [inputValue, setInputValue] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	return {
		state: {
			inputValue,
		},
		operations: { handleInputChange },
	};
};
