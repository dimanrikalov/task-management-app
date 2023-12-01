import classNames from 'classnames';
import { extractTokens } from '@/utils';
import { useEffect, useState } from 'react';
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
	colleagueIds: number[];
	disableDeletionFor?: number[];
	selectedWorkspace?: IDetailedWorkspace | null;
	addColleagueHandler(colleagueId: number): void;
	removeColleagueHandler(colleagueId: number): void;
}

export const AddColleagueInput = ({
	title,
	colleagueIds,
	boardMode = false,
	selectedWorkspace,
	enableFlex = false,
	addColleagueHandler,
	removeColleagueHandler,
	disableDeletionFor = [],
}: IAddColleagueInputProps) => {
	const [inputValue, setInputValue] = useState('');
	const [results, setResults] = useState<IUser[]>([]);
	const [matches, setMatches] = useState<IUser[]>([]);
	const { userData: data } = useOutletContext<IOutletContext>();

	useEffect(() => {
		const { accessToken } = extractTokens();


		fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setResults(data as IUser[]);
			})
			.catch((err) => {
				console.log(err.message);
			});
	}, []);

	useEffect(() => {
		if (inputValue === '') {
			setResults(results);
		}
	}, [inputValue]);

	// Update matches when workspaceData changes
	useEffect(() => {
		if (boardMode) {
			setMatches(
				results.filter((user) => {
					if (
						user.email.toLowerCase().trim().includes(inputValue.toLowerCase().trim()) &&
						!colleagueIds.includes(user.id) &&
						user.id !== data.id &&
						user.id !== selectedWorkspace?.ownerId
					) {
						return user;
					}
				})
			);
			return;
		}
		setMatches(
			results.filter((user) => {
				if (
					user.email.toLowerCase().trim().includes(inputValue.toLowerCase().trim()) &&
					!colleagueIds.includes(user.id) &&
					user.id !== data.id
				) {
					return user;
				}
			})
		);

	}, [inputValue, results, boardMode, colleagueIds, data.id, selectedWorkspace?.ownerId]);

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		if (boardMode) {
			setMatches(results.filter((user) => {
				if (user.email.toLowerCase().trim()
					.includes(e.target.value.toLowerCase().trim())
					//need to filter out user adding themselves as well as adding workspace owner
					&& !colleagueIds.includes(user.id) && user.id !== data.id &&
					user.id !== selectedWorkspace?.ownerId
				) {
					return user;
				}
			}));
			return;
		}

		setMatches(results.filter((user) => {
			if (user.email.toLowerCase().trim()
				.includes(e.target.value.toLowerCase().trim())
				//need to filter out user adding themselves as well as adding workspace owner
				&& !colleagueIds.includes(user.id) && user.id !== data.id
			) {
				return user;
			}
		}));
	};

	const addUser = (id: number) => {
		addColleagueHandler(id);
		setInputValue('');
	};

	const removeUser = (id: number) => {
		removeColleagueHandler(id);
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
					mode='users'
					title={title}
					users={results}
					removeUser={removeUser}
					colleagueIds={[...colleagueIds, boardMode && selectedWorkspace?.ownerId || 0, data.id]}
					disableDeletionFor={[boardMode && selectedWorkspace?.ownerId || 0, ...disableDeletionFor, data.id]}
				/>
			</div>
		</div>
	);
};
