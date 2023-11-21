import styles from './emailInput.module.css';
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
	);
};
