import { MdCancel } from 'react-icons/md';
import styles from './userEntry.module.css';

interface IUserEntryInterface {
	email: string;
	onClick?(): void;
}

export const UserEntry = ({ email, onClick }: IUserEntryInterface) => {
	return (
		<div className={styles.entry}>
			<p>{email}</p>
			<MdCancel className={styles.icon} onClick={onClick} />
		</div>
	);
};
