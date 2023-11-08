import classNames from 'classnames';
import styles from './button.module.css';

interface IButtonProps {
	onClick?(): void;
	message?: string;
	fontSize?: number;
	invert?: boolean;
	icon?: React.ReactNode;
}

export const Button = ({ onClick, message, icon, fontSize, invert }: IButtonProps) => {
	return (
		<button
			className={classNames(styles.button, invert && styles.invert )}
			style={{ fontSize: fontSize || '16px' }}
			onClick={onClick}
		>
			{icon}
			{message}
		</button>
	);
};
