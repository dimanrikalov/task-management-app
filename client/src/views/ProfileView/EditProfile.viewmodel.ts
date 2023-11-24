import { useEffect, useState } from 'react';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IInputValues {
	password: string;
	lastName: string;
	firstName: string;
}

interface IEditProfileViewModelState {
	profileImg: File | null;
	profileImgPath: string | null;
	inputValues: IInputValues;
	isDeletionModalOpen: boolean;
}

interface IEditProfileViewModelOperations {
	inputChangeHandler(
		e: React.ChangeEvent<HTMLInputElement>,
		fieldName: string
	): void;
	clearProfileImg(): void;
	handleProfileImgUpload(): void;
	toggleIsDeletionModalOpen(): void;
	handleProfileImgChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const useProfileViewModel = (): ViewModelReturnType<
	IEditProfileViewModelState,
	IEditProfileViewModelOperations
> => {
	const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
	const [inputValues, setInputValues] = useState({
		firstName: '',
		lastName: '',
		password: '',
	});

	const [profileImg, setProfileImg] = useState<File | null>(null);
	const [profileImgPath, setProfileImgPath] = useState<string | null>(null);

	useEffect(() => {
		if (!profileImg) {
			setProfileImgPath(null);
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setProfileImgPath(reader.result as string);
		};

		reader.readAsDataURL(profileImg);
	}, [profileImg]);

	const handleProfileImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setProfileImg(e.target.files[0]);
		}
		e.target.value = '';
	};

	const clearProfileImg = () => {
		setProfileImg(null);
		setProfileImgPath(null);
	};

	const handleProfileImgUpload = async () => {
		if (!profileImg) {
			console.log('No image uploaded!');
			return;
		}
		const formData = new FormData();

		formData.append('image', profileImg);
		try {
			const response = await fetch('localhost:3001/user', {
				method: 'PUT',
				body: formData,
			});

			console.log(response);
			setProfileImg(null);
			setProfileImgPath(null);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	const inputChangeHandler = (
		e: React.ChangeEvent<HTMLInputElement>,
		fieldName: string
	) => {
		setInputValues((prev) => ({ ...prev, [fieldName]: e.target.value }));
	};

	const toggleIsDeletionModalOpen = () => {
		setIsDeletionModalOpen((prev) => !prev);
	};

	return {
		state: { inputValues, profileImg, profileImgPath, isDeletionModalOpen },
		operations: {
			clearProfileImg,
			inputChangeHandler,
			handleProfileImgUpload,
			handleProfileImgChange,
			toggleIsDeletionModalOpen,
		},
	};
};
