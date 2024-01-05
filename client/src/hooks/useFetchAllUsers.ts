import { useEffect, useState } from 'react';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

export const useFetchAllUsers = () => {
    const dispatch = useAppDispatch();
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { accessToken } = useAppSelector((state) => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const data = (await request({
                    accessToken,
                    method: METHODS.GET,
                    endpoint: USER_ENDPOINTS.BASE
                })) as IUser[];

                const users = data.map((user) => ({
                    ...user,
                    profileImagePath: `data:image/png;base64,${user.profileImagePath}`
                }));
                setAllUsers(users);
            } catch (err: any) {
                console.log(err.message);
                dispatch(setErrorMessageAsync(err.message));
            }
            setIsLoading(false);
        };

        fetchUsers();
    }, []);

    return {
        allUsers,
        isLoading
    };
};
