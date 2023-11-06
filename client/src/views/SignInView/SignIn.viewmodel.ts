import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

	const signIn = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('signing in...');
	};

	return {
		state: { inputFields },
		operations: {
			signIn,
			goToSignUpView,
			goToInitialView,
			handleInputChange,
		},
	};
};
