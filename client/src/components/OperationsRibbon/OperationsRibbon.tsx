import { MdLibraryAdd } from 'react-icons/md';
import { HiDocumentAdd } from 'react-icons/hi';
import styles from './operationsRibbon.module.css';
import { FaChevronLeft, FaUserEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const OperationsRibbon = () => {
	const navigate = useNavigate();

	const goToCreateWorkspace = () => {
		navigate('/workspace');
	};

	const goToCreateBoard = () => {
		navigate('/boards');
	};

	const goToProfileSettings = () => {
		navigate('/user-settings');
	};

	return (
		<div className={styles.background}>
			<MdLibraryAdd
				size={24}
				className={styles.icon}
				onClick={goToCreateWorkspace}
			/>
			<HiDocumentAdd
				size={24}
				className={styles.icon}
				onClick={goToCreateBoard}
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
