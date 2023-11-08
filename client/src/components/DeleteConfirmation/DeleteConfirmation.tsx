import { Button } from '../Button/Button';
import styles from './deleteConfirmation.module.css';

interface IDeleteConfirmationAlert {
	entityName: string;
}

export const DeleteConfirmation = ({
	entityName,
}: IDeleteConfirmationAlert) => {
	return (
		<div className={styles.background}>
			<p>
				Are you sure you want to delete{' '}
				<span className={styles.bold}>{entityName}</span>?
			</p>
			<div className={styles.operationsContainer}>
				<Button fontSize={14} message="Cancel" invert={true} />
				<Button fontSize={14} message="Confirm" invert={true} />
			</div>
		</div>
	);
};
