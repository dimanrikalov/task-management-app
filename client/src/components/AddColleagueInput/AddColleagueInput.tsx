import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './addColleagueInput.module.css';
import { IOutletContext } from '@/guards/authGuard';
import { EmailInput } from '../EmailInput/EmailInput';
import { ListContainer } from '../ListContainer/ListContainer';

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

export const AddColleagueInput = ({
	title,
	colleagues,
	enableFlex = false,
	addColleagueHandler,
	removeColleagueHandler,
	disableDeletionFor = [],
}: IAddColleagueInputProps) => {
	const [inputValue, setInputValue] = useState('');
	const [matches, setMatches] = useState<IUser[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { accessToken } = useOutletContext<IOutletContext>();

	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true);
			try {
				const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: inputValue.trim(),
						notIn: (colleagues || []).map(colleague => colleague.id)
					})
				});
				const data = await res.json();

				setMatches(data);
			} catch (err: any) {
				console.log(err.message);
			}
			setIsLoading(false);
		};

		const timeout = setTimeout(() => {
			if (!inputValue) return;
			fetchUsers();
		}, 300);

		return () => clearTimeout(timeout);
	}, [inputValue]);



	const addUser = (colleague: IUser) => {
		addColleagueHandler(colleague);
		setInputValue('');
	};

	const removeUser = (colleague: IUser) => {
		removeColleagueHandler(colleague);
	};

	const inputChangeHandler =
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setIsLoading(true);
			setInputValue(e.target.value);
		};

	return (
		<div className={
			classNames(styles.background,
				enableFlex && styles.backgroundFlex
			)
		}>
			<div className={
				classNames(styles.top,
					enableFlex && styles.topFlex)
			}>
				<h2>Add Colleagues</h2>
				<EmailInput
					matches={matches}
					addUser={addUser}
					isLoading={isLoading}
					inputValue={inputValue}
					onChange={inputChangeHandler}
				/>
			</div>
			<div className={
				classNames(enableFlex && styles.bottomFlex)
			}>
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
