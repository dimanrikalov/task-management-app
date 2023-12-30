import {
	ISearchInputs,
	ENTRIES_TYPES,
	IHomeBoardEntry,
	IHomeWorkspaceEntry,
} from '@/views/HomeView/Home.viewmodel';
import styles from './homeDashboard.module.css';
import { HomeList } from '../HomeList/HomeList';
import { HomeStats } from '../HomeStats/HomeStats';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';

interface IHomeGridStatsProps {
	boards: IHomeBoardEntry[];
	searchInputs: ISearchInputs;
	workspaces: IHomeWorkspaceEntry[];
	filterHandler(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const HomeDashboard = ({
	boards,
	workspaces,
	searchInputs,
	filterHandler,
}: IHomeGridStatsProps) => {
	return (
		<div className={styles.background}>
			<div className={styles.grid}>
				<div className={styles.boards}>
					<div className={styles.header}>
						<h2>Boards</h2>
						<div>
							<IntroInput
								type="text"
								name="searchBoards"
								onChange={filterHandler}
								placeholder="Enter board name"
								value={searchInputs.searchBoards}
							/>
						</div>
					</div>
					<HomeList
						entries={boards}
						type={ENTRIES_TYPES.BOARDS}
					/>
				</div>

				<div className={styles.workspaces}>
					<div className={styles.header}>
						<h2>Workspaces</h2>
						<div className={styles.inputContainer}>
							<IntroInput
								type="text"
								name="searchWorkspaces"
								onChange={filterHandler}
								placeholder="Enter workspace name"
								value={searchInputs.searchWorkspaces}
							/>
						</div>
					</div>
					<HomeList
						entries={workspaces}
						type={ENTRIES_TYPES.WORKSPACES}
					/>
				</div>

				<HomeStats />
			</div>
		</div>
	);
};
