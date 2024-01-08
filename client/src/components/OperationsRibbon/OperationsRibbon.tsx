import { MdLibraryAdd } from 'react-icons/md';
import { HiDocumentAdd } from 'react-icons/hi';
import styles from './operationsRibbon.module.css';
import { FaChevronLeft, FaUserEdit } from 'react-icons/fa';
import { useModalsContext } from '@/contexts/modals.context';
import { useSelectedWorkspaceContext } from '@/contexts/selectedWorkspace.context';

export const OperationsRibbon = () => {
    const { toggleModal } = useModalsContext();
    const { clearWorkspaceName } = useSelectedWorkspaceContext();

    const toggleisWorkspaceModalOpen = () => {
        toggleModal('showCreateWorkspaceModal');
    };

    const toggleIsCreateBoardModalOpen = () => {
        toggleModal('showCreateBoardModal');
        clearWorkspaceName();
    };

    const toggleIsEditProfileModalOpen = () => {
        toggleModal('showEditProfileModal');
    };

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
