import { ROUTES } from '@/router';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';
import { ErrorContext, IErrorContext } from '@/contexts/ErrorContext';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IInputFields {
	email: string;
	password: string;
}

interface ISignInViewmodelState {
	inputFields: IInputFields;
}

interface ISignInViewmodelOperations {
	goToSignUpView(): void;
	goToInitialView(): void;
	signIn(e: React.FormEvent): void;
	handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useSignInViewmodel = (): ViewModelReturnType<
	ISignInViewmodelState,
	ISignInViewmodelOperations
> => {
	const navigate = useNavigate();
	const { setErrorMessage } = useContext<IErrorContext>(ErrorContext);
	const [inputFields, setInputFields] = useState<IInputFields>({
		email: '',
		password: '',
	});

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

	const goToSignUpView = () => {
		navigate(ROUTES.SIGN_UP);
	};

	const signIn = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const data = await request({
				method: METHODS.POST,
				endpoint: USER_ENDPOINTS.SIGN_IN,
				body: {
					email: inputFields.email,
					password: inputFields.password,
				},
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
			signIn,
			goToSignUpView,
			goToInitialView,
			handleInputChange,
		},
	};
};
