import { ROUTES } from '@/router';
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
		navigate(ROUTES.SIGN_IN);
	};

	const signUpHandler = () => {
		navigate(ROUTES.SIGN_UP);
	};

	return {
		state: {},
		operations: {
			signInHandler,
			signUpHandler,
		},
	};
};
