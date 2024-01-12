import { useState } from 'react';
import { ROUTES } from '../../router';
import { setRefreshToken } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/contexts/user.context';
import { useErrorContext } from '../../contexts/error.context';
import { METHODS, USER_ENDPOINTS, request } from '../../utils/requester';
import { ViewModelReturnType } from '../../interfaces/viewModel.interface';

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
	const { showError } = useErrorContext();
	const { setAccessToken } = useUserContext();
	const [inputFields, setInputFields] = useState<IInputFields>({
		email: '',
		password: ''
	});

	const goToInitialView = () => {
		navigate(ROUTES.HOME);
	};

	const goToSignUpView = () => {
		navigate(ROUTES.SIGN_UP);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputFields((prevInputFields) => ({
			...prevInputFields,
			[name]: value
		}));
	};

	const signIn = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (Object.values(inputFields).some((value) => value === '')) {
				throw new Error('All fields are required!');
			}

			const data = await request({
				body: inputFields,
				method: METHODS.POST,
				endpoint: USER_ENDPOINTS.SIGN_IN
			});

			//case where the endpoint actually throws an exception
			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			setAccessToken(data.accessToken);
			setRefreshToken(data.refreshToken);

			navigate(ROUTES.DASHBOARD);
		} catch (err: any) {
			showError(err.message);
		}
	};

	return {
		state: {
			inputFields
		},
		operations: {
			signIn,
			goToSignUpView,
			goToInitialView,
			handleInputChange
		}
	};
};
