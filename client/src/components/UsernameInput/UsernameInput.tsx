import styles from './usernameInput.module.css';
import { UserEntry } from '../UserEntry/UserEntry';
import { IntroInput } from '../IntroInput/IntroInput';
import { IUser } from '../AddColleagueInput/AddColleagueInput';

interface IUsernameInputProps {
	matches: IUser[];
	isLoading: boolean;
	inputValue: string;
	addUser(colleague: IUser): void;
	onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const UsernameInput = ({
	addUser,
	matches,
	onChange,
	isLoading,
	inputValue
}: IUsernameInputProps) => {
	return (
		<div className={styles.input}>
			<IntroInput
				type="text"
				name="username"
				value={inputValue}
				onChange={onChange}
				placeholder="Enter colleague username"
			/>
			{inputValue && !isLoading && matches.length > 0 && (
				<div className={styles.dropdownWrapper}>
					<div className={styles.dropdown}>
						{matches.map((match) => (
							<UserEntry
								key={match.id}
								showBtn={false}
								username={match.username}
								addHandler={() => addUser(match)}
								profileImgPath={match.profileImagePath}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
