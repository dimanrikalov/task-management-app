
import classNames from 'classnames';
import { ROUTES } from '../../router';
import { FaUserEdit } from 'react-icons/fa'
import styles from './operations.module.css'
import { MdLibraryAdd } from 'react-icons/md'
import { HiDocumentAdd } from 'react-icons/hi'
import { PiSignOutBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../contexts/user.context';
import { useModalsContext } from '../../contexts/modals.context';
import { useSelectedWorkspaceContext } from '../../contexts/selectedWorkspace.context';


export const Operations = () => {
    const navigate = useNavigate();
    const { logout } = useUserContext();
    const { toggleModal } = useModalsContext();
    const { clearWorkspaceName } = useSelectedWorkspaceContext();

    const handleLogout = () => {
        logout();
        navigate(ROUTES.HOME);
    }

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
            <div
                onClick={handleLogout}
                className={classNames(styles.operation, styles.logout)}>
                <PiSignOutBold className={styles.logoutIcon} />
            </div>
            <div
                onClick={toggleisWorkspaceModalOpen}
                className={classNames(styles.operation, styles.createWorkspace)}
            >
                <MdLibraryAdd
                    className={styles.icon}
                />

            </div>
            <div
                onClick={toggleIsCreateBoardModalOpen}
                className={classNames(styles.operation, styles.createBoard)}
            >
                <HiDocumentAdd
                    className={styles.icon}
                />

            </div>
            <div
                onClick={toggleIsEditProfileModalOpen}
                className={classNames(styles.operation, styles.editProfile)}
            >
                <FaUserEdit
                    className={styles.icon}
                />
            </div>
        </div>
    )
}