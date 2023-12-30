import styles from './home.module.css';
import { Modal } from '@/components/Modal/Modal';
import { HomeHeader } from '@/components/HomeHeader/HomeHeader';
import { EditProfileView } from '../ProfileView/EditProfile.view';
import { CreateBoardView } from '../CreateBoardView/CreateBoard.view';
import { MODALS_STATE_KEYS, useHomeViewModel } from './Home.viewmodel';
import { HomeDashboard } from '@/components/HomeDashboard/HomeDashboard';
import { OperationsRibbon } from '@/components/OperationsRibbon/OperationsRibbon';
import { CreateWorkspaceView } from '../CreateWorkspaceView/CreateWorkspace.view';

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
					<HomeHeader
						date={state.date}
						logout={operations.logout}
						lastName={state.userData.lastName}
						firstName={state.userData.firstName}
						profileImgPath={state.userData.profileImagePath}
					/>
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
