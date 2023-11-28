import styles from './home.module.css';
import { TbLogout2 } from 'react-icons/tb';
import { Modal } from '@/components/Modal/Modal';
import { useHomeViewModel } from './Home.viewmodel';
import { EditProfileView } from '../ProfileView/EditProfile.view';
import { CreateBoardView } from '../CreateBoardView/CreateBoard.view';
import { HomeGridStats } from '@/components/HomeGridStats/HomeGridStats';
import { CreateWorkspaceView } from '../CreateWorkspaceView/CreateWorkspace.view';
import { OperationsRibbon } from '@/components/OperationsRibbon/OperationsRibbon';

export const HomeView = () => {
	const { state, operations } = useHomeViewModel();

	return (
		<>
			{state.isCreateWorkspaceModalOpen && (
				<Modal
					children={
						<CreateWorkspaceView
							closeBtnHandler={
								operations.toggleCreateWorkspaceModal
							}
						/>
					}
				/>
			)}
			{state.isCreateBoardModalOpen && (
				<Modal
					children={
						<CreateBoardView
							closeBtnHandler={operations.toggleCreateBoardModal}
						/>
					}
				/>
			)}
			{state.isEditProfileModalOpen && (
				<Modal
					children={
						<EditProfileView
							closeBtnHandler={operations.toggleEditProfileModal}
						/>
					}
				/>
			)}
			<div className={styles.background}>
				<div className={styles.mainContainer}>
					<div className={styles.header}>
						<div className={styles.dashboard}>
							<h1>Dashboard</h1>
							<h4>Tuesday, 17 October 2023</h4>
						</div>
						<div className={styles.userData}>
							<div className={styles.userInitialsIcon}>DR</div>
							<p className={styles.fullName}>{`${state.userData.first_name} ${state.userData.last_name}`}</p>
							<TbLogout2
								className={styles.logout}
								onClick={operations.logout}
							/>
						</div>
					</div>
					<div className={styles.operationsContainer}>
						<OperationsRibbon
							createBoardBtnHandler={
								operations.toggleCreateBoardModal
							}
							createWorkspaceBtnHandler={
								operations.toggleCreateWorkspaceModal
							}
							editProfileBtnHandler={
								operations.toggleEditProfileModal
							}
						/>
					</div>
					<HomeGridStats
						boards={state.boards}
						workspaces={state.workspaces}
						goToBoard={operations.goToBoard}
					/>
				</div>
			</div>
		</>
	);
};
