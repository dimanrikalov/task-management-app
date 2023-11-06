import { useNavigate } from 'react-router';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IIntroViewModelState {}

interface IIntroViewModelOperations {
	signInHandler(): void;
	signUpHandler(): void;
}
export const useIntroViewModel = (): ViewModelReturnType<
	IIntroViewModelState,
	IIntroViewModelOperations
> => {
	const navigate = useNavigate();

	const signInHandler = () => {
		navigate('/auth/sign-in');
	};

	const signUpHandler = () => {
		navigate('/auth/sign-up');
	};

	return {
		state: {},
		operations: {
			signInHandler,
			signUpHandler,
		},
	};
};
