import styles from './input.module.css';

export interface IInputProps {
	name: string;
	type: string;
	value: string;
	onChange(e: React.ChangeEvent<HTMLInputElement>): void;
	placeholder: string;
}

export const Input = ({
	name,
	type,
	value,
	onChange,
	placeholder,
}: IInputProps) => {
	return (
		<input
			name={name}
			type={type}
			value={value}
			onChange={onChange}
			className={styles.input}
			placeholder={placeholder}
		/>
	);
};
