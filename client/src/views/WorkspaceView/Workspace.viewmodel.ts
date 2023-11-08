import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IWorkspaceViewModelState {
	inputValue: string;
	editColleaguesModalIsOpen: boolean;
	deleteWorkspaceModalIsOpen: boolean;
}

interface IWorkspaceViewModelOperations {
	backBtnHandler(): void;
	toggleEditcolleaguesModalIsOpen(): void;
	toggleDeleteWorkspaceModalIsOpen(): void;
	inputChangeHandler(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useWorkspaceViewModel = (): ViewModelReturnType<
	IWorkspaceViewModelState,
	IWorkspaceViewModelOperations
> => {
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');
	const [editColleaguesModalIsOpen, setEditColleaguesModalIsOpen] =
		useState(false);
	const [deleteWorkspaceModalIsOpen, setDeleteWorkspaceModalIsOpen] =
		useState(false);

	const backBtnHandler = () => {
		navigate('/dashboard');
	};

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const toggleEditcolleaguesModalIsOpen = () => {
		setEditColleaguesModalIsOpen((prev) => !prev);
	};

	const toggleDeleteWorkspaceModalIsOpen = () => {
		setDeleteWorkspaceModalIsOpen((prev) => !prev);
	};

	return {
		state: {
			inputValue,
			editColleaguesModalIsOpen,
			deleteWorkspaceModalIsOpen,
		},
		operations: {
			backBtnHandler,
			inputChangeHandler,
			toggleEditcolleaguesModalIsOpen,
			toggleDeleteWorkspaceModalIsOpen,
		},
	};
};
