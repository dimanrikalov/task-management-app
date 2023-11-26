import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './addColleagueInput.module.css';
import { EmailInput } from '../EmailInput/EmailInput';
import { ListContainer } from '../ListContainer/ListContainer';
import { extractTokens, isAccessTokenValid, refreshTokens } from '@/utils';

export interface IUser {
	id: number;
	email: string;
	profileImagePath: string;
}
interface IAddColleagueInputProps {
	title: string;
	enableFlex?: boolean;
}

export const AddColleagueInput = ({ title, enableFlex = false }: IAddColleagueInputProps) => {
	const [inputValue, setInputValue] = useState('');
	const [results, setResults] = useState<IUser[]>([]);
	const [matches, setMatches] = useState<IUser[]>([]);
	const [colleagueIds, setColleagueIds] = useState<number[]>([]);

	useEffect(() => {
		const { accessToken } = extractTokens();
		if (!isAccessTokenValid(accessToken)) {
			refreshTokens();
		}

		fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})
			.then(res => res.json())
			.then(data => {
				setResults(data as IUser[]);
			})
			.catch(err => {
				console.log(err.message)
			});
	}, []);

	useEffect(() => {
		if (inputValue === '') {
			setResults(results);
		}
	}, [inputValue]);

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		setMatches(results.filter((user) => {
			if (user.email.includes(e.target.value) && !colleagueIds.includes(user.id)) {
				return user;
			}
		}));
	};

	const addUser = (id: number) => {
		setColleagueIds((prev) => [...prev, id]);
		setInputValue('');
	}

	const removeUser = (id: number) => {
		setColleagueIds((prev) => [...prev.filter(colleagueId => colleagueId !== id)]);
	}

	return (
		<div className={classNames(styles.background, enableFlex && styles.backgroundFlex)}>
			<div className={classNames(styles.top, enableFlex && styles.topFlex)}>
				<h2>Add Colleagues</h2>
				<EmailInput
					matches={matches}
					inputValue={inputValue}
					onChange={inputChangeHandler}
					addUser={addUser}
				/>
			</div>
			<div className={classNames(enableFlex && styles.bottomFlex)}>
				<ListContainer
					title={title}
					mode='users'
					removeUser={removeUser}
					colleagueIds={colleagueIds}
					users={results}
				/>
			</div>
		</div>
	);
};
