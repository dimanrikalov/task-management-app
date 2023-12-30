import {
	toggleCreateBoardModal,
	toggleEditProfileModal,
	toggleCreateWorkspaceModal,
} from '@/app/modalsSlice';
import { useAppDispatch } from '@/app/hooks';
import { MdLibraryAdd } from 'react-icons/md';
import { HiDocumentAdd } from 'react-icons/hi';
import styles from './operationsRibbon.module.css';
import { setWorkspaceName } from '@/app/inputValuesSlice';
import { FaChevronLeft, FaUserEdit } from 'react-icons/fa';

export const OperationsRibbon = () => {
	const dispatch = useAppDispatch();


	const toggleisWorkspaceModalOpen = () => {
		dispatch(toggleCreateWorkspaceModal());
	}

	const toggleIsCreateBoardModalOpen = () => {
		dispatch(toggleCreateBoardModal());
		dispatch(setWorkspaceName({ workspaceName: '' }));
	}

	const toggleIsEditProfileModalOpen = () => {
		dispatch(toggleEditProfileModal());
	}

	return (
		<div className={styles.background}>
			<MdLibraryAdd
				size={24}
				className={styles.icon}
				onClick={toggleisWorkspaceModalOpen}
			/>
			<HiDocumentAdd
				size={24}
				className={styles.icon}
				onClick={toggleIsCreateBoardModalOpen}
			/>
			<FaUserEdit
				size={24}
				className={styles.icon}
				onClick={toggleIsEditProfileModalOpen}
			/>
			<FaChevronLeft size={24} className={styles.icon} />
		</div>
	);
};
