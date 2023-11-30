import { BsCheckLg } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { HomeCard } from '../HomeCard/HomeCard';
import styles from './homeGridStats.module.css';
import { LuMessageSquare } from 'react-icons/lu';
import { HiOutlineDocument } from 'react-icons/hi';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';
import { MdOutlineLibraryBooks, MdPendingActions } from 'react-icons/md';
import { ISearchInputs, IUserStats } from '@/views/HomeView/Home.viewmodel';

interface IHomeGridStatsProps {
	boards: any[];
	workspaces: any[];
	userStats: IUserStats;
	searchInputs: ISearchInputs;
	filterHandler(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const HomeGridStats = ({ boards, workspaces, userStats, filterHandler, searchInputs }: IHomeGridStatsProps) => {
	const navigate = useNavigate();

	return (
		<div className={styles.background}>
			<div className={styles.grid}>
				<div className={styles.boards}>
					<div className={styles.header}>
						<h2>Boards</h2>
						<div>
							<IntroInput name="searchBoards"
								onChange={filterHandler}
								placeholder="Enter board name"
								type="text"
								value={searchInputs.searchBoards}
							/>
						</div>
					</div>
					<div className={styles.list}>
						{
							boards.length > 0 ?
								boards.map((board) =>
									<HomeCard
										userCount={12}
										key={board.id}
										isBoardBtn={true}
										title={board.name}
										subtitle={'Workspace name'}
										onClick={() => navigate(`/boards/${board.id}`)}
									/>
								) :
								<h1 className={styles.noBoards}>You don't have access to any boards yet...</h1>
						}
					</div>
				</div>
				<div className={styles.workspaces}>
					<div className={styles.header}>
						<h2>Workspaces</h2>
						<div className={styles.inputContainer}>
							<IntroInput
								name="searchWorkspaces"
								onChange={filterHandler}
								placeholder="Enter workspace name"
								type="text"
								value={searchInputs.searchWorkspaces}
							/>
						</div>
					</div>

					<div className={styles.list}>
						{
							workspaces.length > 0 ?
								workspaces.map((workspace) =>
									<HomeCard
										userCount={12}
										key={workspace.id}
										isWorkspaceBtn={true}
										onClick={() => navigate(`/workspaces/${workspace.id}`)}
										title={workspace.name}
										subtitle={`${workspace.owner.firstName} ${workspace.owner.lastName}`}
									/>
								) :
								<h1 className={styles.noWorkspaces}>You don't have access to any workspaces yet...</h1>
						}
					</div>
				</div>

				<div className={styles.completeTasks}>
					<div className={styles.header}>
						<BsCheckLg className={styles.icon} />{' '}
						<h2 className={styles.value}>
							{
								userStats.completedTasksCount === -1 ?
									'Fetching' : userStats.completedTasksCount
							}
						</h2>
					</div>
					<h3 className={styles.statName}>Tasks Completed</h3>
				</div>
				<div className={styles.pendingTasks}>
					<div className={styles.header}>
						<h2 className={styles.value}>
							{
								userStats.pendingTasksCount === -1 ?
									'Fetching' : userStats.pendingTasksCount
							}
						</h2>
						<MdPendingActions className={styles.icon} />
					</div>
					<h3 className={styles.statName}>Pending Tasks</h3>
				</div>
				<div className={styles.totalBoards}>
					<div className={styles.header}>
						<MdOutlineLibraryBooks className={styles.icon} />
						<h3 className={styles.statName}>Boards</h3>
					</div>
					<h2 className={styles.value}>
						{
							userStats.boardsCount === -1 ?
								'Fetching' : userStats.boardsCount
						}
					</h2>
				</div>
				<div className={styles.totalWorkspaces}>
					<h3 className={styles.statName}>Workspaces</h3>
					<div className={styles.bottom}>
						<HiOutlineDocument className={styles.icon} />
						<h2 className={styles.value}>
							{
								userStats.workspacesCount === -1 ?
									'Fetching' : userStats.workspacesCount
							}
						</h2>
					</div>
				</div>
				<div className={styles.totalMessages}>
					<h3 className={styles.statName}>Messages</h3>
					<div className={styles.bottom}>
						<LuMessageSquare className={styles.icon} />
						<h2 className={styles.value}>
							{
								userStats.messagesCount === -1 ?
									'Fetching' : userStats.messagesCount
							}
						</h2>
					</div>
				</div>
			</div>
		</div>
	);
};
