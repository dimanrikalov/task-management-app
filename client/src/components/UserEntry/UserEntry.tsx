import classNames from 'classnames';
import { MdCancel } from 'react-icons/md';
import styles from './userEntry.module.css';

interface IUserEntryInterface {
	username: string;
	showBtn?: boolean;
	addHandler?(): void;
	removeHandler?(): void;
	profileImgPath: string;
}

export const UserEntry = ({
	username,
	addHandler,
	removeHandler,
	profileImgPath,
	showBtn = true
}: IUserEntryInterface) => {
	return (
		<div
			onClick={addHandler}
			className={classNames(styles.entry, !showBtn && styles.center)}
		>
			<div className={styles.leftSide}>
				<img src={profileImgPath} alt="user-img" />
				<p>{username}</p>
			</div>
			{showBtn && (
				<MdCancel className={styles.icon} onClick={removeHandler} />
			)}
		</div>
	);
};
