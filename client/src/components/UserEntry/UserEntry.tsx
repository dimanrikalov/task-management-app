import { MdCancel } from 'react-icons/md';
import styles from './userEntry.module.css';
import classNames from 'classnames';

interface IUserEntryInterface {
	email: string;
	addHandler?(): void;
	removeHandler?(): void;
	showBtn?: boolean;
}

export const UserEntry = ({ email, addHandler, removeHandler, showBtn = true }: IUserEntryInterface) => {
	return (
		<div onClick={addHandler} className={classNames(styles.entry, !showBtn && styles.center)}>
			<div className={styles.leftSide}>
				<img src="/imgs/profile-img.jpeg" alt="user-img" />
				<p>{email}</p>
			</div>
			{showBtn && <MdCancel className={styles.icon} onClick={removeHandler} />}
		</div>
	);
};
