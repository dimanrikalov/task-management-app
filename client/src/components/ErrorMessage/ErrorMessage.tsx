import styles from './errorMessage.module.css';

interface IErrorMessageProps {
	message: string;
	fontSize?: number;
}

export const ErrorMessage = ({ message, fontSize }: IErrorMessageProps) => {
	return (
		<div
			className={styles.container}
			style={{
				fontSize: fontSize ? fontSize : 14,
				visibility: message ? 'visible' : 'hidden',
			}}
		>
			<p className={styles.errorMsg}>{message}</p>
		</div>
	);
};
