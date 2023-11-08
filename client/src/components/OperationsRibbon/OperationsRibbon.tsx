import { MdLibraryAdd } from 'react-icons/md';
import { HiDocumentAdd } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import styles from './operationsRibbon.module.css';
import { FaChevronLeft, FaUserEdit } from 'react-icons/fa';

interface IOperationsRibbonProps {
	createBoardBtnHandler(): void;
	createWorkspaceBtnHandler(): void;
}

export const OperationsRibbon = ({
	createBoardBtnHandler,
	createWorkspaceBtnHandler,
}: IOperationsRibbonProps) => {
	const navigate = useNavigate();

	const goToProfileSettings = () => {
		navigate('/user-settings');
	};

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
				onClick={goToProfileSettings}
			/>
			<FaChevronLeft size={24} className={styles.icon} />
		</div>
	);
};
