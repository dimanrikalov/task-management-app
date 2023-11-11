import { BsCheckLg } from 'react-icons/bs';
import { HomeCard } from '../HomeCard/HomeCard';
import styles from './homeGridStats.module.css';
import { LuMessageSquare } from 'react-icons/lu';
import { HiOutlineDocument } from 'react-icons/hi';
import { MdOutlineLibraryBooks, MdPendingActions } from 'react-icons/md';
import { Input } from '../Input/Input';

interface IHomeGridStatsProps {
	goToBoard(): void;
}

export const HomeGridStats = ({ goToBoard }: IHomeGridStatsProps) => {
	return (
		<div className={styles.background}>
			<div className={styles.grid}>
				<div className={styles.boards}>
					<div className={styles.header}>
						<h2>Boards</h2>
						<div>
							<Input
								name="find-board"
								onChange={() => {}}
								placeholder="Enter board name"
								type="text"
								value=""
							/>
						</div>
					</div>
					<div className={styles.list}>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
					</div>
				</div>
				<div className={styles.workspaces}>
					<div className={styles.header}>
						<h2>Workspaces</h2>
						<div className={styles.inputContainer}>
							<Input
								name="find-workspace"
								onChange={() => {}}
								placeholder="Enter workspace name"
								type="text"
								value=""
							/>
						</div>
					</div>

					<div className={styles.list}>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={goToBoard}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
					</div>
				</div>

				<div className={styles.completeTasks}>
					<div className={styles.header}>
						<BsCheckLg className={styles.icon} />{' '}
						<h2 className={styles.value}>2131</h2>
					</div>
					<h3>Tasks Completed</h3>
				</div>
				<div className={styles.pendingTasks}>
					<div className={styles.header}>
						<h2 className={styles.value}>13</h2>
						<MdPendingActions className={styles.icon} />
					</div>
					<h3>Pending Tasks</h3>
				</div>
				<div className={styles.totalBoards}>
					<div className={styles.header}>
						<MdOutlineLibraryBooks className={styles.icon} />
						<h3>Boards</h3>
					</div>
					<h2 className={styles.value}>462</h2>
				</div>
				<div className={styles.totalWorkspaces}>
					<h3>Workspaces</h3>
					<div className={styles.bottom}>
						<HiOutlineDocument className={styles.icon} />
						<h2 className={styles.value}>128</h2>
					</div>
				</div>
				<div className={styles.totalMessages}>
					<h3>Messages</h3>
					<div className={styles.bottom}>
						<LuMessageSquare className={styles.icon} />
						<h2 className={styles.value}>512</h2>
					</div>
				</div>
			</div>
		</div>
	);
};
