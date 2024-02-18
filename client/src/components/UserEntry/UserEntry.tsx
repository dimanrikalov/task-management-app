import classNames from 'classnames';
import { MdCancel } from 'react-icons/md';
import styles from './userEntry.module.css';

interface IUserEntryInterface {
	tagMode?: boolean;
	username: string;
	showBtn?: boolean;
	addHandler?(): void;
	isDropdown?: boolean;
	removeHandler?(): void;
	profileImgPath: string;
}

export const UserEntry = ({
	username,
	addHandler,
	removeHandler,
	profileImgPath,
	showBtn = true,
	tagMode = false,
	isDropdown = false,
}: IUserEntryInterface) => {
	return (
		<div
			onClick={addHandler}
			className={
				classNames(styles.entry,
					tagMode && styles.tagMode,
					!showBtn && styles.center,
					isDropdown && styles.entryDropdown,
				)}
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
