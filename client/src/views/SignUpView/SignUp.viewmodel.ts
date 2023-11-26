import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IInputFields {
	email: string;
	lastName: string;
	password: string;
	firstName: string;
	[key: string]: string; // Add this index signature
}
interface ISignUpViewModelState {
	errorMessage: string;
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
	const [errorMessage, setErrorMessage] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputFields((prevInputFields) => ({
			...prevInputFields,
			[name]: value,
		}));
	};

	const goToInitialView = () => {
		navigate('/');
	};

	const goToSignInView = () => {
		navigate('/auth/sign-in');
	};

	const signUp = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			console.log(inputFields);
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/users/sign-up`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(inputFields),
					credentials: 'include',
				}
			);

			const data = await res.json();
			if (data.statusCode === 400) {
				throw new Error(data.message[0]);
			}
			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			navigate('/dashboard');
		} catch (err: any) {
			console.log(err.message);
			setErrorMessage(err.message);
		}
	};

	return {
		state: {
			inputFields,
			errorMessage,
		},
		operations: {
			signUp,
			goToSignInView,
			goToInitialView,
			handleInputChange,
		},
	};
};
