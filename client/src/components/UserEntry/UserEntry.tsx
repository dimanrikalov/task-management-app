import { MdCancel } from 'react-icons/md';
import styles from './userEntry.module.css';
import classNames from 'classnames';

interface IUserEntryInterface {
	email: string;
	onClick?(): void;
	showBtn?: boolean;
}

export const UserEntry = ({ email, onClick, showBtn = true }: IUserEntryInterface) => {
	return (
		<div className={classNames(styles.entry, !showBtn && styles.center)}>
			<img src="/imgs/profile-img.jpeg" alt="user-img" />
			<p>{email}</p>
			{showBtn && <MdCancel className={styles.icon} onClick={onClick} />}
		</div>
	);
};
