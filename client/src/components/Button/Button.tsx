import styles from './button.module.css';

interface IButtonProps {
	onClick(): void;
	message?: string;
	fontSize?: number;
	icon?: React.ReactNode;
}

export const Button = ({ onClick, message, icon, fontSize }: IButtonProps) => {
	return (
		<button
			className={styles.button}
			style={{ fontSize: fontSize || '16px' }}
			onClick={onClick}
		>
			{icon}
			{message}
		</button>
	);
};
