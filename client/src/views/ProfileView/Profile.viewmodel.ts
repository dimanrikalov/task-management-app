import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IInputValues {
	firstName: string;
	lastName: string;
	password: string;
}

interface IProfileViewModelState {
	inputValues: IInputValues;
	isDeletionModalOpen: boolean;
}

interface IProfileViewModelOperations {
	goBack(): void;
	inputChangeHandler(
		e: React.ChangeEvent<HTMLInputElement>,
		fieldName: string
	): void;
	toggleIsDeletionModalOpen(): void;
}

export const useProfileViewModel = (): ViewModelReturnType<
	IProfileViewModelState,
	IProfileViewModelOperations
> => {
	const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
	const [inputValues, setInputValues] = useState({
		firstName: '',
		lastName: '',
		password: '',
	});
	const navigate = useNavigate();

	const goBack = () => {
		navigate('/dashboard');
	};

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
		operations: { goBack, inputChangeHandler, toggleIsDeletionModalOpen },
	};
};
