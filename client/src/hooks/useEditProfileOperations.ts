import { generateImgUrl } from '@/utils';
import { useEffect, useState } from 'react';
import { useErrorContext } from '../contexts/error.context';
import { convertImageToBase64 } from '@/utils/convertImages';
import { useModalsContext } from '../contexts/modals.context';
import { METHODS, USER_ENDPOINTS, request } from '../utils/requester';
import { useNotificationContext } from '../contexts/notification.context';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z]).{4,}$/;

enum INPUT_FIELDS {
	EMAIL = 'email',
	PASSWORD = 'password',
	USERNAME = 'username',
	PROFILE_IMG = 'profileImg'
}

interface IInputValues {
	email: string;
	password: string;
	username: string;
	profileImg: File | null;
}

export const useEditProfileModal = () => {
	const {
		logout,
		setData,
		accessToken,
		data: userData
	} = useUserContext() as IUserContextSecure;
	const { showError } = useErrorContext();
	const { toggleModal } = useModalsContext();
	const { showNotification } = useNotificationContext();
	const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
	const [profileImgPath, setProfileImgPath] = useState<string | null>(null);
	const [inputValues, setInputValues] = useState<IInputValues>({
		email: '',
		username: '',
		password: '',
		profileImg: null
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

	const updateUserData = async (e: React.FormEvent) => {
		e.preventDefault();
		const inputField = (e.currentTarget as HTMLFormElement)
			.name as INPUT_FIELDS;

		try {
			if (inputField === INPUT_FIELDS.PROFILE_IMG) {
				await requestProfileImgUpdate();
			} else {
				await requestCredentialUpdate(inputField);
			}
			setProfileImgPath(null);
			setInputValues((prev) => ({ ...prev, profileImg: null }));

			showNotification('Update successful!');
		} catch (err: any) {
			console.log(err.message);
			setInputValues((prev) => ({
				...prev,
				[inputField]:
					inputField === INPUT_FIELDS.PROFILE_IMG ? null : ''
			}));
			if (inputField === INPUT_FIELDS.PROFILE_IMG) {
				setProfileImgPath(null);
			}

			showError(err.message);
		}
	};

	const requestCredentialUpdate = async (inputField: INPUT_FIELDS) => {
		if (
			inputField === INPUT_FIELDS.USERNAME &&
			(inputValues[inputField] as string).length < 2
		) {
			throw new Error(`New username must be at least 2 characters long!`);
		}
		if (
			inputField === INPUT_FIELDS.USERNAME &&
			(inputValues[inputField] as string).includes(' ')
		) {
			throw new Error('Username cannot contain whitespaces!');
		}
		if (
			inputField === INPUT_FIELDS.EMAIL &&
			(!(inputValues[inputField] as string).includes('@') ||
				(inputValues[inputField] as string).length < 3)
		) {
			throw new Error(`New email must be valid!`);
		}
		if (
			inputField === INPUT_FIELDS.PASSWORD &&
			!passwordRegex.test(inputValues[inputField] as string)
		) {
			throw new Error(
				'Password must conform to the rules:at least 4 characters long, at least 1 capital letter and 1 non-alphabetic symbol.'
			);
		}
		console.log('heree');
		await request({
			accessToken,
			method: METHODS.PUT,
			endpoint: USER_ENDPOINTS.EDIT,
			body: { [inputField]: inputValues[inputField] }
		});

		setData({ ...userData, [inputField]: inputValues[inputField] });

		setInputValues((prev) => ({ ...prev, [inputField]: '' }));
	};

	const requestProfileImgUpdate = async () => {
		if (
			!inputValues.profileImg ||
			!(inputValues.profileImg instanceof File)
		) {
			return;
		}
		const body = new FormData();
		body.append('profileImg', inputValues.profileImg, 'profile-img');

		await request({
			body,
			accessToken,
			method: METHODS.POST,
			endpoint: USER_ENDPOINTS.PROFILE_IMG_EDIT
		});

		const profileImagePath = await convertImageToBase64(
			inputValues.profileImg
		);

		setData({
			...userData,
			profileImagePath: generateImgUrl(profileImagePath)
		});
	};

	const deleteUser = async () => {
		try {
			const accessTokenTemp = accessToken;
			logout();
			await request({
				method: METHODS.DELETE,
				accessToken: accessTokenTemp,
				endpoint: USER_ENDPOINTS.DELETE
			});
			toggleIsEditProfileModalOpen();
		} catch (err: any) {
			showError(err.message);
			setIsDeletionModalOpen(false);
		}
	};

	const changeProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !e.target.files[0]) {
			return;
		}

		setInputValues((prev) => ({
			...prev,
			profileImg: e.target.files![0]
		}));

		e.target.value = '';
	};

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValues((prev) => ({
			...prev,
			[e.target.name]:
				e.target.name === INPUT_FIELDS.USERNAME
					? e.target.value.trim()
					: e.target.value
		}));
	};

	const clearProfileImg = () => {
		setInputValues((prev) => ({ ...prev, profileImg: null }));
		setProfileImgPath(null);
	};

	const toggleIsDeletionModalOpen = () => {
		setIsDeletionModalOpen((prev) => !prev);
	};

	const toggleIsEditProfileModalOpen = () => {
		toggleModal('showEditProfileModal');
	};

	return {
		userData,
		inputValues,
		profileImgPath,
		isDeletionModalOpen,

		deleteUser,
		updateUserData,
		clearProfileImg,
		inputChangeHandler,
		changeProfileImage,
		toggleIsDeletionModalOpen,
		toggleIsEditProfileModalOpen
	};
};
