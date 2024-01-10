import styles from './emailInput.module.css';
import { UserEntry } from '../UserEntry/UserEntry';
import { IntroInput } from '../IntroInput/IntroInput';
import { IUser } from '../AddColleagueInput/AddColleagueInput';

interface IEmailInputProps {
	matches: IUser[];
	isLoading: boolean;
	inputValue: string;
	addUser(colleague: IUser): void;
	onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const EmailInput = ({
	addUser,
	matches,
	onChange,
	isLoading,
	inputValue
}: IEmailInputProps) => {
	return (
		<div className={styles.input}>
			<IntroInput
				type="email"
				name="email"
				value={inputValue}
				onChange={onChange}
				placeholder="Enter colleague email"
			/>
			{inputValue && !isLoading && matches.length > 0 && (
				<div className={styles.dropdownWrapper}>
					<div className={styles.dropdown}>
						{matches.map((match) => (
							<UserEntry
								key={match.id}
								showBtn={false}
								email={match.email}
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
