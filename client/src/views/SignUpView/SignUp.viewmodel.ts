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
	username: string;
	password: string;
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
	const { showError } = useErrorContext();
	const { setAccessToken } = useUserContext();
	const [inputFields, setInputFields] = useState<IInputFields>({
		email: '',
		username: '',
		password: ''
	});

	const goToInitialView = () => {
		navigate(ROUTES.HOME);
	};

	const goToSignInView = () => {
		navigate(ROUTES.SIGN_IN);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputFields((prevInputFields) => {
			return {
				...prevInputFields,
				[name]: name === 'password' ? value : value.trim()
			};
		});
	};

	const signUp = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log(inputFields);
		try {
			if (Object.values(inputFields).some((value) => value === '')) {
				throw new Error('All fields are required!');
			}

			if (inputFields.username.includes(' ')) {
				throw new Error('Username must be one word!');
			}

			const data = await request({
				body: inputFields,
				method: METHODS.POST,
				endpoint: USER_ENDPOINTS.SIGN_UP
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
			signUp,
			goToSignInView,
			goToInitialView,
			handleInputChange
		}
	};
};
