import { Input } from '../Input/Input';
import { MdCancel } from 'react-icons/md';
import { useEffect, useState } from 'react';
import styles from './addColleagueInput.module.css';

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
}

export const AddColleagueInput = ({ title }: IAddColleagueInputProps) => {
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
		<div className={styles.background}>
			<div className={styles.top}>
				<h2>Add Colleagues</h2>
				<div className={styles.input}>
					<Input
						type="email"
						name="workspace-name"
						value={inputValue}
						placeholder="Enter a colleague email"
						onChange={inputChangeHandler}
						fontSize={18}
					/>
					<div className={styles.dropdown}>
						{inputValue !== '' &&
							results.map((x) => {
								return (
									<button className={styles.result}>
										<div>{x}</div>
									</button>
								);
							})}
					</div>
				</div>
			</div>

			<div className={styles.listContainer}>
				<h2>{title}</h2>
				<div className={styles.list}>
					<div className={styles.entry}>
						<p>dimanrikalov1@abv.bg</p>
						<MdCancel className={styles.icon} />
					</div>
					<div className={styles.entry}>
						<p>dimanrikalov1@abv.bg</p>
						<MdCancel className={styles.icon} />
					</div>
					<div className={styles.entry}>
						<p>dimanrikalov1@abv.bg</p>
						<MdCancel className={styles.icon} />
					</div>
					<div className={styles.entry}>
						<p>dimanrikalov1@abv.bg</p>
						<MdCancel className={styles.icon} />
					</div>
					<div className={styles.entry}>
						<p>dimanrikalov1@abv.bg</p>
						<MdCancel className={styles.icon} />
					</div>
					<div className={styles.entry}>
						<p>dimanrikalov1@abv.bg</p>
						<MdCancel className={styles.icon} />
					</div>
					<div className={styles.entry}>
						<p>dimanrikalov1@abv.bg</p>
						<MdCancel className={styles.icon} />
					</div>
					<div className={styles.entry}>
						<p>dimanrikalov1@abv.bg</p>
						<MdCancel className={styles.icon} />
					</div>
					<div className={styles.entry}>
						<p>dimanrikalov1@abv.bg</p>
						<MdCancel className={styles.icon} />
					</div>
					<div className={styles.entry}>
						<p>dimanrikalov1@abv.bg</p>
						<MdCancel className={styles.icon} />
					</div>
				</div>
			</div>
		</div>
	);
};
