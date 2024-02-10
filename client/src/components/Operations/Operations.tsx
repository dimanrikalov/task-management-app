import classNames from 'classnames';
import { FaUserEdit } from 'react-icons/fa';
import styles from './operations.module.css';
import { MdLibraryAdd } from 'react-icons/md';
import { HiDocumentAdd } from 'react-icons/hi';
import { PiSignOutBold } from 'react-icons/pi';
import { useUserContext } from '../../contexts/user.context';
import { useModalsContext } from '../../contexts/modals.context';
import { NotificationList } from '../NotificationList/NotificationList';
import { useNotificationContext } from '@/contexts/notification.context';
import { useSelectedWorkspaceContext } from '../../contexts/selectedWorkspace.context';

export const Operations = () => {
	const {
		isLoading,
		notifications,
		deleteNotification,
		deleteNotifications
	} = useNotificationContext();
	const { data, logout } = useUserContext();
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
			<div
				onClick={logout}
				className={classNames(styles.operation, styles.logout)}
			>
				<PiSignOutBold className={styles.logoutIcon} />
			</div>
			<div
				onClick={toggleisWorkspaceModalOpen}
				className={classNames(styles.operation, styles.createWorkspace)}
			>
				<MdLibraryAdd className={styles.icon} />
			</div>
			<div
				onClick={toggleIsCreateBoardModalOpen}
				className={classNames(styles.operation, styles.createBoard)}
			>
				<HiDocumentAdd className={styles.icon} />
			</div>
			<div
				onClick={toggleIsEditProfileModalOpen}
				className={classNames(styles.operation, styles.editProfile)}
			>
				<FaUserEdit className={styles.icon} />
			</div>
			<div className={styles.notifications}>
				<NotificationList
					isLoading={isLoading}
					username={data!.username}
					notifications={notifications}
					clearNotification={deleteNotification}
					clearNotifications={deleteNotifications}
				/>
			</div>
		</div>
	);
};
