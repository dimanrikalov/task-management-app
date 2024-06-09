import { MdCancel } from 'react-icons/md';
import styles from './stepEntry.module.css';

interface IStepEntryProps {
	onClick(): void;
	description: string;
	isReadOnly?: boolean;
	isCompleted: boolean;
	toggleStatus(): void;
}

export const StepEntry = ({
	onClick,
	description,
	isCompleted,
	toggleStatus,
	isReadOnly = false,
}: IStepEntryProps) => {
	return (
		<div className={styles.container}>
			<p>{description}</p>
			<div className={styles.operations}>
				<input
					type="checkbox"
					disabled={isReadOnly}
					onClick={toggleStatus}
					defaultChecked={isCompleted}
				/>
				<MdCancel className={styles.icon} onClick={onClick} />
			</div>
		</div>
	);
};
