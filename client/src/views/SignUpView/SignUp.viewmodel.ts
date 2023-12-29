import { ROUTES } from '@/router';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';
import { ErrorContext, IErrorContext } from '@/contexts/ErrorContext';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IInputFields {
	email: string;
	lastName: string;
	password: string;
	firstName: string;
	[key: string]: string; // Add this index signature
}
interface ISignUpViewModelState {
	inputFields: IInputFields;
}

interface ISignUpViewModelOperations {
	goToSignInView(): void;
	goToInitialView(): void;
	signUp(e: React.FormEvent): void;
	handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useSignUpViewModel = (): ViewModelReturnType<
	ISignUpViewModelState,
	ISignUpViewModelOperations
> => {
	const navigate = useNavigate();
	const [inputFields, setInputFields] = useState<IInputFields>({
		email: '',
		lastName: '',
		password: '',
		firstName: '',
	});

	const { setErrorMessage } = useContext<IErrorContext>(ErrorContext);
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputFields((prevInputFields) => ({
			...prevInputFields,
			[name]: value,
		}));
	};

	const goToInitialView = () => {
		navigate(ROUTES.HOME);
	};

	const goToSignInView = () => {
		navigate(ROUTES.SIGN_IN);
	};

	const signUp = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const data = await request({
				body: inputFields,
				method: METHODS.POST,
				endpoint: USER_ENDPOINTS.SIGN_UP,
			});

			if (data.statusCode === 400) {
				throw new Error(data.message[0]);
			}
			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			navigate(ROUTES.DASHBOARD);
		} catch (err: any) {
			console.log(err.message);
			setErrorMessage(err.message);
		}
	};

	return {
		state: {
			inputFields,
		},
		operations: {
			signUp,
			goToSignInView,
			goToInitialView,
			handleInputChange,
		},
	};
};
