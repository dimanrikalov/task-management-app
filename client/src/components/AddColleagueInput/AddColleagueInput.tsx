import classNames from 'classnames';
import { generateImgUrl } from '@/utils';
import React, { useEffect, useState } from 'react';
import styles from './addColleagueInput.module.css';
import { useTranslate } from '../../hooks/useTranslate';
import { useUserContext } from '../../contexts/user.context';
import { UsernameInput } from '../UsernameInput/UsernameInput';
import { useErrorContext } from '../../contexts/error.context';
import { ListContainer } from '../ListContainer/ListContainer';
import { METHODS, USER_ENDPOINTS, request } from '../../utils/requester';

export interface IUser {
	id: number;
	email: string;
	username: string;
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
	username: string;
	notIn: number[];
}

const addColleaguesPath = 'addColleagues'

export const AddColleagueInput = ({
	title,
	colleagues,
	enableFlex = false,
	addColleagueHandler,
	removeColleagueHandler,
	disableDeletionFor = []
}: IAddColleagueInputProps) => {
	const { t } = useTranslate()
	const { showError } = useErrorContext();
	const { accessToken } = useUserContext();
	const [inputValue, setInputValue] = useState('');
	const [matches, setMatches] = useState<IUser[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true);

			const body: IFetchUsersPayload = {
				username: inputValue,
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
					profileImagePath: generateImgUrl(match.profileImagePath)
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
	}, [inputValue, colleagues]);

	const addUser = (colleague: IUser) => {
		addColleagueHandler(colleague);
		setInputValue('');
	};

	const removeUser = (colleague: IUser) => {
		removeColleagueHandler(colleague);
	};

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(prev => {
			if (prev !== e.target.value.trim()) {
				setIsLoading(true);
			}
			return e.target.value.trim()
		});
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
				<h2>{t(addColleaguesPath)}</h2>
				<UsernameInput
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
