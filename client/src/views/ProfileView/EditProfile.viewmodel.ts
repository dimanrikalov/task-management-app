import { useState } from 'react';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IInputValues {
	firstName: string;
	lastName: string;
	password: string;
}

interface IEditProfileViewModelState {
	inputValues: IInputValues;
	isDeletionModalOpen: boolean;
}

interface IEditProfileViewModelOperations {
	inputChangeHandler(
		e: React.ChangeEvent<HTMLInputElement>,
		fieldName: string
	): void;
	toggleIsDeletionModalOpen(): void;
}

export const useProfileViewModel = (): ViewModelReturnType<
	IEditProfileViewModelState,
	IEditProfileViewModelOperations
> => {
	const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
	const [inputValues, setInputValues] = useState({
		firstName: '',
		lastName: '',
		password: '',
	});

	const inputChangeHandler = (
		e: React.ChangeEvent<HTMLInputElement>,
		fieldName: string
	) => {
		setInputValues((prev) => ({ ...prev, [fieldName]: e.target.value }));
	};

	const toggleIsDeletionModalOpen = () => {
		setIsDeletionModalOpen((prev) => !prev);
	};

	return {
		state: { inputValues, isDeletionModalOpen },
		operations: { inputChangeHandler, toggleIsDeletionModalOpen },
	};
};
