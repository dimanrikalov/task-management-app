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
		navigate('/sign-in');
	};

	const signUpHandler = () => {
		navigate('/sign-in');
	};

	return {
		state: {},
		operations: {
			signInHandler,
			signUpHandler,
		},
	};
};
