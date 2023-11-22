import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './addColleagueInput.module.css';
import { EmailInput } from '../EmailInput/EmailInput';
import { ListContainer } from '../ListContainer/ListContainer';

const emails = [
	'johnsmith@gmail.com',
	'sarah.jones@gmail.com',
	'kevin.white@gmail.com',
	'laura.davis@gmail.com',
	'sarah.smith@gmail.com',
	'mike.wilson@gmail.com',
	'emily.martin@gmail.com',
	'andrew.brown@gmail.com',
	'david.johnson@gmail.com',
	'lisa.anderson@gmail.com',
	'jessica.taylor@gmail.com',
];

interface IAddColleagueInputProps {
	title: string;
	enableFlex?: boolean;
}

export const AddColleagueInput = ({ title, enableFlex = false }: IAddColleagueInputProps) => {
	const [inputValue, setInputValue] = useState('');
	const [results, setResults] = useState(emails);
	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		setResults(emails.filter((email) => email.includes(e.target.value)));
	};
	useEffect(() => {
		if (inputValue === '') {
			setResults(emails);
		}
	}, [inputValue]);

	return (
		<div className={classNames(styles.background, enableFlex && styles.backgroundFlex)}>
			<div className={classNames(styles.top, enableFlex && styles.topFlex)}>
				<h2>Add Colleagues</h2>
				<EmailInput
					results={results}
					inputValue={inputValue}
					onChange={inputChangeHandler}
				/>
			</div>
			<div className={classNames(enableFlex && styles.bottomFlex)}>
				<ListContainer title={title} mode='users' />
			</div>
		</div>
	);
};
