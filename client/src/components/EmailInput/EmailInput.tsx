import { Input } from '../Input/Input';
import styles from './emailInput.module.css';

interface IEmailInputProps {
	inputValue: string;
	results: string[];
	onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const EmailInput = ({ inputValue, onChange, results }: IEmailInputProps) => {

	return (
		<div className={styles.input}>
			<Input
				type="email"
				name="email"
				value={inputValue}
				placeholder="Enter a colleague email"
				onChange={onChange}
				fontSize={16}
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
