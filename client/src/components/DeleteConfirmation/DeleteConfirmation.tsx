import styles from './deleteConfirmation.module.css';
import { useTranslate } from '../../hooks/useTranslate';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';

interface IDeleteConfirmationAlert {
	onCancel(): void;
	onConfirm(): void;
	entityName: string;
}

const translationPaths = {
	areYouSure: 'confirmationModal.areYouSure',
	confirm: 'confirmationModal.confirm',
	cancel: 'confirmationModal.cancel',
}

export const DeleteConfirmation = ({
	onCancel,
	onConfirm,
	entityName
}: IDeleteConfirmationAlert) => {
	const { t } = useTranslate();

	return (
		<div className={styles.background}>
			<p>
				{t(translationPaths.areYouSure)}{' '}
				<span className={styles.bold}>{entityName}</span>?
			</p>
			<div className={styles.operationsContainer}>
				<IntroButton message={t(translationPaths.cancel)} onClick={onCancel} />
				<IntroButton message={t(translationPaths.confirm)} onClick={onConfirm} />
			</div>
		</div>
	);
};
