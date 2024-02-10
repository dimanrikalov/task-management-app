import { useState } from 'react';
import classNames from 'classnames';
import styles from './introInput.module.css';

interface IIconProps {
	size?: number;
	className?: string;
}

interface IToggleIconProps {
	size?: number;
	className?: string;
}

interface IIntroInputProps {
	name: string;
	type: string;
	value: string;
	onLoad?(): any;
	iconSize?: number;
	condition?: boolean;
	disabled?: boolean;
	placeholder: string;
	Icon?: React.FC<IIconProps>;
	ToggleIcon?: React.FC<IToggleIconProps>;
	onChange(e: React.ChangeEvent<HTMLInputElement>): void;
	handleSelect?: React.ReactEventHandler<HTMLInputElement>;
	inputRef?: React.MutableRefObject<HTMLInputElement | null>;
}

export const IntroInput = ({
	name,
	Icon,
	type,
	value,
	onLoad,
	inputRef,
	onChange,
	iconSize,
	condition,
	ToggleIcon,
	placeholder,
	handleSelect,
	disabled = false
}: IIntroInputProps) => {
	const [isIconColored, setIsIconColored] = useState(false);

	return (
		<div className={styles.inputContainer}>
			<div className={styles.iconContainer}>
				{condition
					? ToggleIcon && (
						<ToggleIcon
							size={iconSize || 16}
							className={classNames(
								isIconColored && styles.colorIcon
							)}
						/>
					)
					: Icon && (
						<Icon
							size={iconSize || 16}
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
				ref={inputRef}
				onLoad={onLoad}
				disabled={disabled}
				onChange={onChange}
				onSelect={handleSelect}
				className={styles.input}
				placeholder={placeholder}
				onBlur={() => setIsIconColored(false)}
				onFocus={() => setIsIconColored(true)}
				style={Icon ? { paddingLeft: '36px' } : { paddingLeft: '7px' }}
			/>
		</div>
	);
};
