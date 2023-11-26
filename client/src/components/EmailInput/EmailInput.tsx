import styles from './emailInput.module.css';
import { UserEntry } from '../UserEntry/UserEntry';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';
import { IUser } from '../AddColleagueInput/AddColleagueInput';

interface IEmailInputProps {
	inputValue: string;
	matches: IUser[];
	onChange(e: React.ChangeEvent<HTMLInputElement>): void;
	addUser(id: number): void;
}

export const EmailInput = ({ inputValue, onChange, matches, addUser }: IEmailInputProps) => {

	return (
		<div className={styles.input}>
			<IntroInput
				type="email"
				name="email"
				value={inputValue}
				placeholder="Enter a colleague email"
				onChange={onChange}
			/>
			{
				inputValue !== '' && matches.length > 0 &&
				<div className={styles.dropdownWrapper}>
					<div className={styles.dropdown}>
						{
							matches.map((match) => <UserEntry
								key={match.id}
								email={match.email}
								showBtn={false}
								addHandler={() => addUser(match.id)}
								removeHandler={()=>{}}
							/>
							)
						}
					</div>
				</div>
			}
		</div>
	);
};
