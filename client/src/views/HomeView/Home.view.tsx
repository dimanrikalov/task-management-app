import styles from './home.module.css';
import { TbLogout2 } from 'react-icons/tb';
import { Modal } from '@/components/Modal/Modal';
import { useHomeViewModel } from './Home.viewmodel';
import { HomeCard } from '@/components/HomeCard/HomeCard';
import { CreateBoardView } from '../CreateBoardView/CreateBoard.view';
import { HomeGridStats } from '@/components/HomeGridStats/HomeGridStats';
import { HorizontalList } from '@/components/HorizontalList/HorizontalList';
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
			<div className={styles.background}>
				<OperationsRibbon
					createBoardBtnHandler={operations.toggleCreateBoardModal}
					createWorkspaceBtnHandler={
						operations.toggleCreateWorkspaceModal
					}
				/>
				<div className={styles.mainContainer}>
					<div className={styles.header}>
						<div className={styles.dashboard}>
							<h2>Dashboard</h2>
							<h4>Tuesday, 17 October 2023</h4>
						</div>
						<div className={styles.userData}>
							<div className={styles.userInitialsIcon}>DR</div>
							<p className={styles.fullName}>Diman Rikalov</p>
							<TbLogout2
								className={styles.logout}
								onClick={() => {}}
							/>
						</div>
					</div>
					<div className={styles.lists}>
						<HomeGridStats />
						<HorizontalList title="Boards" showSearchInput={false}>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>{' '}
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
						</HorizontalList>
						<HorizontalList
							title="Workspaces"
							showSearchInput={false}
						>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>{' '}
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
							<HomeCard
								onClick={() => {}}
								title="Board Name"
								subtitle="Workspace Name"
								userCount={16}
							/>
						</HorizontalList>
					</div>
				</div>
			</div>
		</>
	);
};
