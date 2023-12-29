import { MdLibraryAdd } from 'react-icons/md';
import { HiDocumentAdd } from 'react-icons/hi';
import styles from './operationsRibbon.module.css';
import { FaChevronLeft, FaUserEdit } from 'react-icons/fa';

interface IOperationsRibbonProps {
	createBoardBtnHandler(): void;
	editProfileBtnHandler(): void;
	createWorkspaceBtnHandler(): void;
}

export const OperationsRibbon = ({
	createBoardBtnHandler,
	editProfileBtnHandler,
	createWorkspaceBtnHandler,
}: IOperationsRibbonProps) => {
	return (
		<div className={styles.background}>
			<MdLibraryAdd
				size={24}
				className={styles.icon}
				onClick={createWorkspaceBtnHandler}
			/>
			<HiDocumentAdd
				size={24}
				className={styles.icon}
				onClick={createBoardBtnHandler}
			/>
			<FaUserEdit
				size={24}
				className={styles.icon}
				onClick={editProfileBtnHandler}
			/>
			<FaChevronLeft size={24} className={styles.icon} />
		</div>
	);
};
