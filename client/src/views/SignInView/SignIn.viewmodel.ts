import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IInputFields {
	email: string;
	password: string;
}

interface ISignInViewmodelState {
	errorMessage: string;
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
	const [errorMessage, setErrorMessage] = useState('');
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
		navigate('/');
	};

	const goToSignUpView = () => {
		navigate('/auth/sign-up');
	};

	const signIn = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/users/sign-in`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: inputFields.email,
						password: inputFields.password,
					}),
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
			setErrorMessage(err.message);
			console.log(err.message);
		}
	};

	return {
		state: { errorMessage, inputFields },
		operations: {
			signIn,
			goToSignUpView,
			goToInitialView,
			handleInputChange,
		},
	};
};
