import styles from './home.module.css';
import { useHomeViewModel } from './Home.viewmodel';
import { HomeHeader } from '../../components/HomeHeader/HomeHeader';
import { HomeDashboard } from '../../components/HomeDashboard/HomeDashboard';

export const HomeView = () => {
	const { state, operations } = useHomeViewModel();

	return (
		<div className={styles.background}>
			<div className={styles.mainContainer}>
				<HomeHeader
					date={state.date}
					lastName={state.userData.lastName}
					firstName={state.userData.firstName}
					profileImgPath={state.userData.profileImagePath}
				/>
				<HomeDashboard
					searchInputs={state.searchInputs}
					boards={state.filteredLists.boards}
					isLoadingBoards={state.isLoadingBoards}
					workspaces={state.filteredLists.workspaces}
					isLoadingWorkspaces={state.isLoadingWorkspaces}
					filterHandler={operations.handleFilterInputChange}
				/>
			</div>
		</div>
	);
};
