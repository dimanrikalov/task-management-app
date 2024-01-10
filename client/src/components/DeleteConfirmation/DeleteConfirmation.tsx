import styles from './deleteConfirmation.module.css';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';

interface IDeleteConfirmationAlert {
	onCancel(): void;
	onConfirm(): void;
	entityName: string;
}

export const DeleteConfirmation = ({
	onCancel,
	onConfirm,
	entityName
}: IDeleteConfirmationAlert) => {
	return (
		<div className={styles.background}>
			<p>
				Are you sure you want to delete{' '}
				<span className={styles.bold}>{entityName}</span>?
			</p>
			<div className={styles.operationsContainer}>
				<IntroButton message="Cancel" onClick={onCancel} />
				<IntroButton message="Confirm" onClick={onConfirm} />
			</div>
		</div>
	);
};
