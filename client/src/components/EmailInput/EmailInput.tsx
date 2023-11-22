import styles from './emailInput.module.css';
import { UserEntry } from '../UserEntry/UserEntry';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';

interface IEmailInputProps {
	inputValue: string;
	results: string[];
	onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const EmailInput = ({ inputValue, onChange, results }: IEmailInputProps) => {

	return (
		<div className={styles.input}>
			<IntroInput
				type="email"
				name="email"
				value={inputValue}
				placeholder="Enter a colleague email"
				onChange={onChange}
			/>
			{inputValue !== '' && results.length > 0 && <div className={styles.dropdownWrapper}>
				<div className={styles.dropdown}>
					{
						results.map((x) => <UserEntry email={x} showBtn={false} />)
					}
				</div>
			</div>
			}
		</div>
	);
};
