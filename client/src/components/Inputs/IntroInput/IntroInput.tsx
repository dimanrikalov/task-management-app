import { useState } from 'react';
import classNames from 'classnames';
import styles from './introInput.module.css';

interface IIconProps {
	className?: string;
}

interface IToggleIconProps {
	className?: string;
}

interface IIntroInputProps {
	name: string;
	type: string;
	value: string;
	placeholder: string;
	Icon?: React.FC<IIconProps>;
	ToggleIcon?: React.FC<IToggleIconProps>;
	onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const IntroInput = ({
	name,
	Icon,
	type,
	value,
	onChange,
	ToggleIcon,
	placeholder,
}: IIntroInputProps) => {
	const [isIconColored, setIsIconColored] = useState(false);

	return (
		<div className={styles.inputContainer}>
			<div className={styles.iconContainer}>
				{value
					? ToggleIcon && (
							<ToggleIcon
								className={classNames(
									isIconColored && styles.colorIcon
								)}
							/>
					  )
					: Icon && (
							<Icon
								className={classNames(
									isIconColored && styles.colorIcon
								)}
							/>
					  )}
			</div>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				className={styles.input}
				placeholder={placeholder}
				onBlur={() => setIsIconColored(false)}
				onFocus={() => setIsIconColored(true)}
				style={Icon ? { paddingLeft: '36px' } : { paddingLeft: '7px' }}
			/>
		</div>
	);
};
