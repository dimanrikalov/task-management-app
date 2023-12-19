import styles from './home.module.css';
import { TbLogout2 } from 'react-icons/tb';
import { Modal } from '@/components/Modal/Modal';
import { EditProfileView } from '../ProfileView/EditProfile.view';
import { CreateBoardView } from '../CreateBoardView/CreateBoard.view';
import { MODALS_STATE_KEYS, useHomeViewModel } from './Home.viewmodel';
import { HomeDashboard } from '@/components/HomeDashboard/HomeDashboard';
import { CreateWorkspaceView } from '../CreateWorkspaceView/CreateWorkspace.view';
import { OperationsRibbon } from '@/components/OperationsRibbon/OperationsRibbon';

export const HomeView = () => {
	const { state, operations } = useHomeViewModel();

	return (
		<>
			{state.modalsState.createWorkspaceIsOpen && (
				<Modal
					children={
						<CreateWorkspaceView
							closeBtnHandler={
								() => operations.toggleModal(MODALS_STATE_KEYS.CREATE_WORKSPACE_IS_OPEN)
							}
						/>
					}
				/>
			)}
			{state.modalsState.createBoardIsOpen && (
				<Modal
					children={
						<CreateBoardView
							closeBtnHandler={() => operations.toggleModal(MODALS_STATE_KEYS.CREATE_BOARD_IS_OPEN)}
						/>
					}
				/>
			)}
			{state.modalsState.editProfileIsOpen && (
				<Modal
					children={
						<EditProfileView
							closeBtnHandler={() => operations.toggleModal(MODALS_STATE_KEYS.EDIT_PROFILE_IS_OPEN)}
						/>
					}
				/>
			)}
			<div className={styles.background}>
				<div className={styles.mainContainer}>
					<div className={styles.header}>
						<div className={styles.dashboard}>
							<h1>Dashboard</h1>
							<h4>{state.date}</h4>
						</div>
						<div className={styles.userData}>
							<div className={styles.userInitialsIcon}>
								{
									`${state.userData.firstName[0].toUpperCase()}${state.userData.lastName[0].toUpperCase()}`
								}
							</div>
							<p className={styles.fullName}>{`${state.userData.firstName} ${state.userData.lastName}`}</p>
							<TbLogout2
								className={styles.logout}
								onClick={operations.logout}
							/>
						</div>
					</div>
					<div className={styles.operationsContainer}>
						<OperationsRibbon
							createWorkspaceBtnHandler={
								() => operations.toggleModal(MODALS_STATE_KEYS.CREATE_WORKSPACE_IS_OPEN)
							}
							createBoardBtnHandler={
								() => operations.toggleModal(MODALS_STATE_KEYS.CREATE_BOARD_IS_OPEN)
							}
							editProfileBtnHandler={
								() => operations.toggleModal(MODALS_STATE_KEYS.EDIT_PROFILE_IS_OPEN)
							}
						/>
					</div>
					<HomeDashboard
						userStats={state.userStats}
						searchInputs={state.searchInputs}
						boards={state.filteredLists.boards}
						workspaces={state.filteredLists.workspaces}
						filterHandler={operations.handleFilterInputChange}
					/>
				</div>
			</div>
		</>
	);
};
