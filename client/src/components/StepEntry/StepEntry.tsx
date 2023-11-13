import { MdCancel } from 'react-icons/md';
import styles from './stepEntry.module.css';

interface IStepEntryProps {
	onClick?(): void;
	description: string;
	isCompleted: boolean;
}

export const StepEntry = ({
	description,
	isCompleted,
	onClick,
}: IStepEntryProps) => {
	return (
		<div className={styles.container}>
			<p>{description}</p>
			<div className={styles.operations}>
				<input type="checkbox" checked={isCompleted} />
				<MdCancel className={styles.icon} onClick={onClick} />
			</div>
		</div>
	);
};
