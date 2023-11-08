import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IWorkspaceViewModelState {
	inputValue: string;
}

interface IWorkspaceViewModelOperations {
	backBtnHandler(): void;
	inputChangeHandler(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useWorkspaceViewModel = (): ViewModelReturnType<
	IWorkspaceViewModelState,
	IWorkspaceViewModelOperations
> => {
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');

	const backBtnHandler = () => {
		navigate('/dashboard');
	};

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	return {
		state: { inputValue },
		operations: {
			backBtnHandler,
			inputChangeHandler,
		},
	};
};
