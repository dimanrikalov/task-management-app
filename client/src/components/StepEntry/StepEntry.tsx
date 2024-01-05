import { MdCancel } from 'react-icons/md';
import styles from './stepEntry.module.css';

interface IStepEntryProps {
    onClick(): void;
    description: string;
    isCompleted: boolean;
    toggleStatus(): void;
}

export const StepEntry = ({
    description,
    isCompleted,
    onClick,
    toggleStatus
}: IStepEntryProps) => {
    return (
        <div className={styles.container}>
            <p>{description}</p>
            <div className={styles.operations}>
                <input
                    type="checkbox"
                    onClick={toggleStatus}
                    defaultChecked={isCompleted}
                />
                <MdCancel className={styles.icon} onClick={onClick} />
            </div>
        </div>
    );
};
