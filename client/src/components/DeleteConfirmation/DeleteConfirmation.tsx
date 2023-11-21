import styles from './deleteConfirmation.module.css';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';

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
				<IntroButton message="Cancel" />
				<IntroButton message="Confirm" />
			</div>
		</div>
	);
};
