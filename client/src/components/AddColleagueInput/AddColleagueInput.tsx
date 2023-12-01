import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './addColleagueInput.module.css';
import { IOutletContext } from '@/guards/authGuard';
import { EmailInput } from '../EmailInput/EmailInput';
import { ListContainer } from '../ListContainer/ListContainer';
import { IDetailedWorkspace } from '@/views/CreateBoardView/CreateBoard.viewmodel';

export interface IUser {
	id: number;
	email: string;
	profileImagePath: string;
}

interface IAddColleagueInputProps {
	title: string;
	boardMode?: boolean;
	enableFlex?: boolean;
	colleagues: IUser[];
	disableDeletionFor?: number[];
	selectedWorkspace?: IDetailedWorkspace | null;
	addColleagueHandler(colleague: IUser): void;
	removeColleagueHandler(colleague: IUser): void;
}

export const AddColleagueInput = ({
	title,
	colleagues,
	boardMode = false,
	selectedWorkspace,
	enableFlex = false,
	addColleagueHandler,
	removeColleagueHandler,
	disableDeletionFor = [],
}: IAddColleagueInputProps) => {
	const [inputValue, setInputValue] = useState('');
	const [matches, setMatches] = useState<IUser[]>([]);
	const { userData, accessToken } = useOutletContext<IOutletContext>();

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (!inputValue) return;
			fetchUsers();
		}, 300);

		return () => clearTimeout(timeout);
	}, [inputValue]);

	const fetchUsers = async () => {
		try {
			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: inputValue.trim(),
					notIn: colleagueIds
				})
			});
			const data = await res.json();
			console.log(data);
			setMatches(data);
		} catch (err: any) {
			console.log(err.message);
		}
	};

	const addUser = (id: number) => {
		addColleagueHandler(id);
		setInputValue('');
	};

	const removeUser = (id: number) => {
		removeColleagueHandler(id);
	};

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	return (
		<div className={classNames(styles.background, enableFlex && styles.backgroundFlex)}>
			<div className={classNames(styles.top, enableFlex && styles.topFlex)}>
				<h2>Add Colleagues</h2>
				<EmailInput
					matches={matches}
					addUser={addUser}
					inputValue={inputValue}
					onChange={inputChangeHandler}
				/>
			</div>
			<div className={classNames(enableFlex && styles.bottomFlex)}>
				<ListContainer
					mode="users"
					title={title}
					users={matches}
					removeUser={removeUser}
					colleagues={[...colleagues]}
					disableDeletionFor={[boardMode && selectedWorkspace?.ownerId || 0, ...disableDeletionFor, userData.id]}
				/>
			</div>
		</div>
	);
};
