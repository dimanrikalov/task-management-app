import styles from './emailInput.module.css';
import { UserEntry } from '../UserEntry/UserEntry';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';
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
	inputValue,
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
			{
				inputValue &&
				!isLoading &&
				matches.length > 0 &&
				(
					<div className={styles.dropdownWrapper}>
						<div className={styles.dropdown}>
							{
								matches.map((match) =>
									<UserEntry
										key={match.id}
										email={match.email}
										showBtn={false}
										addHandler={() => addUser(match)}
									/>
								)
							}
						</div>
					</div>
				)
			}
		</div>
	);
};
