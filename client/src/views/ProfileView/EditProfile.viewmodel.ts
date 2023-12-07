import { deleteTokens } from '@/utils';
import { useEffect, useState } from 'react';
import { IOutletContext, IUserData } from '@/guards/authGuard';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z]).{4,}$/;

export enum NOTIFICATION_TYPE {
	ERROR = 'error',
	MESSAGE = 'message',
}

enum INPUT_FIELDS {
	PASSWORD = 'password',
	LAST_NAME = 'lastName',
	FIRST_NAME = 'firstName',
	PROFILE_IMG = 'profileImg',
}

interface INotification {
	message: string;
	type: NOTIFICATION_TYPE;
}

interface IInputValues {
	password: string;
	lastName: string;
	firstName: string;
	profileImg: File | null;
}

interface IEditProfileViewModelState {
	userData: IUserData;
	inputValues: IInputValues;
	notification: INotification;
	isDeletionModalOpen: boolean;
	profileImgPath: string | null;
}

interface IEditProfileViewModelOperations {
	deleteUser(): void;
	clearProfileImg(): void;
	toggleIsDeletionModalOpen(): void;
	updateUserImg(e: React.FormEvent): void;
	updateUserData(e: React.FormEvent): void;
	inputChangeHandler(e: React.ChangeEvent<HTMLInputElement>): void;
	changeProfileImage(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useProfileViewModel = (): ViewModelReturnType<
	IEditProfileViewModelState,
	IEditProfileViewModelOperations
> => {
	const navigate = useNavigate();
	const { accessToken, userData } = useOutletContext<IOutletContext>();
	const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
	const [profileImgPath, setProfileImgPath] = useState<string | null>(null);
	const [notification, setNotification] = useState<INotification>({
		message: '',
		type: NOTIFICATION_TYPE.MESSAGE,
	});
	const [inputValues, setInputValues] = useState<IInputValues>({
		lastName: '',
		password: '',
		firstName: '',
		profileImg: null,
	});

	useEffect(() => {
		if (!inputValues.profileImg) {
			setProfileImgPath(null);
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setProfileImgPath(reader.result as string);
		};

		reader.readAsDataURL(inputValues.profileImg);
	}, [inputValues]);

	const changeProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !e.target.files[0]) {
			return;
		}

		setInputValues((prev) => ({
			...prev,
			profileImg: e.target.files![0],
		}));

		e.target.value = '';
	};

	const clearProfileImg = () => {
		setInputValues((prev) => ({ ...prev, profileImg: null }));
		setProfileImgPath(null);
	};

	const updateUserData = async (e: React.FormEvent) => {
		e.preventDefault();
		const inputField = (e.currentTarget as HTMLFormElement)
			.name as INPUT_FIELDS;

		try {
			if (
				[INPUT_FIELDS.FIRST_NAME, INPUT_FIELDS.LAST_NAME].includes(
					inputField
				) &&
				(inputValues[inputField] as string).length < 2
			) {
				throw new Error(
					`${inputField} must be at least 2 characters long!`
				);
			}

			if (
				inputField === INPUT_FIELDS.PASSWORD &&
				!passwordRegex.test(inputValues[inputField] as string)
			) {
				throw new Error('Password must conform to the rules!');
			}

			await fetch(`${import.meta.env.VITE_SERVER_URL}/users/edit`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					[inputField]: inputValues[inputField],
				}),
			});

			setProfileImgPath(null);
			setInputValues((prev) => ({ ...prev, profileImg: null }));
			navigate('/'); // cause refetching of user through the guard
		} catch (err: any) {
			console.log(err.message);
			setInputValues({
				password: '',
				lastName: '',
				firstName: '',
				profileImg: null,
			});
			setNotification({
				message: err.message,
				type: NOTIFICATION_TYPE.ERROR,
			});
		}
	};

	const updateUserImg = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (
				!inputValues.profileImg ||
				!(inputValues.profileImg instanceof File)
			) {
				return;
			}
			let body;
			body = new FormData();
			body.append('profileImg', inputValues.profileImg, 'profile-img');

			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/users/edit/profile-img`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
					body,
				}
			);
			const data = await res.json();
			console.log(data);
			setProfileImgPath(null);
			setInputValues((prev) => ({ ...prev, profileImg: null }));
			navigate('/'); // cause refetching of user through the guard
		} catch (err: any) {
			console.log('asdasdasdads');
			console.log(err.message);
			setInputValues({
				password: '',
				lastName: '',
				firstName: '',
				profileImg: null,
			});
			setNotification({
				message: err.message,
				type: NOTIFICATION_TYPE.ERROR,
			});
		}
	};

	const deleteUser = async () => {
		try {
			await fetch(`${import.meta.env.VITE_SERVER_URL}/users/delete`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});
			deleteTokens();
			navigate('/');
		} catch (err: any) {
			setIsDeletionModalOpen(false);
			setNotification({
				message: err.message,
				type: NOTIFICATION_TYPE.ERROR,
			});
		}
	};

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValues((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const toggleIsDeletionModalOpen = () => {
		setIsDeletionModalOpen((prev) => !prev);
	};

	return {
		state: {
			userData,
			inputValues,
			notification,
			profileImgPath,
			isDeletionModalOpen,
		},
		operations: {
			deleteUser,
			updateUserImg,
			updateUserData,
			clearProfileImg,
			inputChangeHandler,
			changeProfileImage,
			toggleIsDeletionModalOpen,
		},
	};
};
