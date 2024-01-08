import { ROUTES } from '@/router';
import { deleteTokens } from '@/utils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useErrorContext } from '@/contexts/error.context';
import { useModalsContext } from '@/contexts/modals.context';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';
import { useNotificationContext } from '@/contexts/notification.context';
import { IUserContextSecure, useUserContext } from '@/contexts/user.context';

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z]).{4,}$/;

enum INPUT_FIELDS {
    PASSWORD = 'password',
    LAST_NAME = 'lastName',
    FIRST_NAME = 'firstName',
    PROFILE_IMG = 'profileImg'
}

interface IInputValues {
    password: string;
    lastName: string;
    firstName: string;
    profileImg: File | null;
}

export const useEditProfileModal = () => {
    const navigate = useNavigate();
    const { showError } = useErrorContext();
    const { toggleModal } = useModalsContext();
    const { showNotification } = useNotificationContext();
    const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
    const [profileImgPath, setProfileImgPath] = useState<string | null>(null);
    const { data: userData, accessToken } =
        useUserContext() as IUserContextSecure;
    const [inputValues, setInputValues] = useState<IInputValues>({
        lastName: '',
        password: '',
        firstName: '',
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
            navigate(ROUTES.HOME); // cause refetching of user data through the guard
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

        await request({
            accessToken,
            method: METHODS.PUT,
            endpoint: USER_ENDPOINTS.EDIT,
            body: { [inputField]: inputValues[inputField] }
        });
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
    };

    const deleteUser = async () => {
        try {
            await request({
                accessToken,
                method: METHODS.DELETE,
                endpoint: USER_ENDPOINTS.DELETE
            });
            deleteTokens();
            navigate(ROUTES.HOME); // force refetching of user through the guard
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
            [e.target.name]: e.target.value
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
