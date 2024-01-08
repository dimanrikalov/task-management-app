import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import styles from './addColleagueInput.module.css';
import { EmailInput } from '../EmailInput/EmailInput';
import { useUserContext } from '@/contexts/user.context';
import { useErrorContext } from '@/contexts/error.context';
import { ListContainer } from '../ListContainer/ListContainer';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';

export interface IUser {
    id: number;
    email: string;
    profileImagePath: string;
}

interface IAddColleagueInputProps {
    title: string;
    colleagues: IUser[];
    enableFlex?: boolean;
    disableDeletionFor?: number[];
    addColleagueHandler(colleague: IUser): void;
    removeColleagueHandler(colleague: IUser): void;
}

interface IFetchUsersPayload {
    email: string;
    notIn: number[];
}

export const AddColleagueInput = ({
    title,
    colleagues,
    enableFlex = false,
    addColleagueHandler,
    removeColleagueHandler,
    disableDeletionFor = []
}: IAddColleagueInputProps) => {
    const { showError } = useErrorContext();
    const { accessToken } = useUserContext();
    const [inputValue, setInputValue] = useState('');
    const [matches, setMatches] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);

            const body: IFetchUsersPayload = {
                email: inputValue.trim(),
                notIn: (colleagues || []).map((colleague) => colleague.id)
            };

            try {
                const data = (await request({
                    body,
                    accessToken,
                    method: METHODS.POST,
                    endpoint: USER_ENDPOINTS.BASE
                })) as IUser[];

                const matchesData = data.map((match) => ({
                    ...match,
                    profileImagePath: `data:image/png;base64,${match.profileImagePath}`
                }));

                setMatches(matchesData);
            } catch (err: any) {
                console.log(err.message);
                showError(err.message);
            }
            setIsLoading(false);
        };

        const timeout = setTimeout(() => {
            if (!inputValue) return;
            fetchUsers();
        }, 100);

        return () => clearTimeout(timeout);
    }, [inputValue]);

    const addUser = (colleague: IUser) => {
        addColleagueHandler(colleague);
        setInputValue('');
    };

    const removeUser = (colleague: IUser) => {
        removeColleagueHandler(colleague);
    };

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        setInputValue(e.target.value);
    };

    return (
        <div
            className={classNames(
                styles.background,
                enableFlex && styles.backgroundFlex
            )}
        >
            <div
                className={classNames(styles.top, enableFlex && styles.topFlex)}
            >
                <h2>Add Colleagues</h2>
                <EmailInput
                    matches={matches}
                    addUser={addUser}
                    isLoading={isLoading}
                    inputValue={inputValue}
                    onChange={inputChangeHandler}
                />
            </div>
            <div className={classNames(enableFlex && styles.bottomFlex)}>
                <ListContainer
                    mode="users"
                    title={title}
                    removeUser={removeUser}
                    colleagues={colleagues}
                    disableDeletionFor={disableDeletionFor}
                />
            </div>
        </div>
    );
};
