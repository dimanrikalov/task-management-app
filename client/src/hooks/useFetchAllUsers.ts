import { useEffect, useState } from 'react';
import { useErrorContext } from '../contexts/error.context';
import { METHODS, USER_ENDPOINTS, request } from '../utils/requester';
import { IUser } from '../components/AddColleagueInput/AddColleagueInput';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';

export const useFetchAllUsers = () => {
	const { showError } = useErrorContext();
	const [allUsers, setAllUsers] = useState<IUser[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { accessToken } = useUserContext() as IUserContextSecure;

	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true);
			try {
				const data = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: USER_ENDPOINTS.BASE,
				})) as IUser[];

				const users = data.map((user) => ({
					...user,
					profileImagePath: `data:image/png;base64,${user.profileImagePath}`,
				}));
				setAllUsers(users);
			} catch (err: any) {
				console.log(err.message);
				showError(err.message);
			}
			setIsLoading(false);
		};

		fetchUsers();
	}, []);

	return {
		allUsers,
		isLoading,
	};
};
