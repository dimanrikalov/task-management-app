import styles from './input.module.css';

export interface IInputProps {
	name: string;
	type: string;
	value: string;
	fontSize?: number;
	onChange(e: React.ChangeEvent<HTMLInputElement>): void;
	placeholder: string;
}

export const Input = ({
	name,
	type,
	value,
	fontSize,
	onChange,
	placeholder,
}: IInputProps) => {
	return (
		<input
			style={{ fontSize: fontSize ? fontSize : 15 }}
			name={name}
			type={type}
			value={value}
			onChange={onChange}
			className={styles.input}
			placeholder={placeholder}
		/>
	);
};
