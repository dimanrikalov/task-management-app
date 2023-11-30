import styles from './home.module.css';
import { TbLogout2 } from 'react-icons/tb';
import { Modal } from '@/components/Modal/Modal';
import { EditProfileView } from '../ProfileView/EditProfile.view';
import { CreateBoardView } from '../CreateBoardView/CreateBoard.view';
import { IModalsStateKeys, useHomeViewModel } from './Home.viewmodel';
import { HomeGridStats } from '@/components/HomeGridStats/HomeGridStats';
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
								() => operations.toggleModal(IModalsStateKeys.CREATE_WORKSPACE_IS_OPEN)
							}
						/>
					}
				/>
			)}
			{state.modalsState.createBoardIsOpen && (
				<Modal
					children={
						<CreateBoardView
							closeBtnHandler={() => operations.toggleModal(IModalsStateKeys.CREATE_BOARD_IS_OPEN)}
						/>
					}
				/>
			)}
			{state.modalsState.editProfileIsOpen && (
				<Modal
					children={
						<EditProfileView
							closeBtnHandler={() => operations.toggleModal(IModalsStateKeys.EDIT_PROFILE_IS_OPEN)}
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
							createWorkspaceBtnHandler={
								() => operations.toggleModal(IModalsStateKeys.CREATE_WORKSPACE_IS_OPEN)
							}
							createBoardBtnHandler={
								() => operations.toggleModal(IModalsStateKeys.CREATE_BOARD_IS_OPEN)
							}
							editProfileBtnHandler={
								() => operations.toggleModal(IModalsStateKeys.EDIT_PROFILE_IS_OPEN)
							}
						/>
					</div>
					<HomeGridStats
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
