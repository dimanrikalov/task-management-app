import { BsCheckLg } from 'react-icons/bs';
import { HomeCard } from '../HomeCard/HomeCard';
import styles from './homeGridStats.module.css';
import { LuMessageSquare } from 'react-icons/lu';
import { HiOutlineDocument } from 'react-icons/hi';
import { MdOutlineLibraryBooks, MdPendingActions } from 'react-icons/md';

export const HomeGridStats = () => {
	return (
		<div className={styles.background}>
			<div className={styles.grid}>
				<div className={styles.boards}>
					<h2>Your Boards</h2>
					<div className={styles.list}>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isBoardBtn={true}
						/>
					</div>
				</div>
				<div className={styles.workspaces}>
					<h2>Your Workspaces</h2>

					<div className={styles.list}>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
							isWorkspaceBtn={true}
						/>
					</div>
				</div>

				<div className={styles.completeTasks} id="tiltDiv">
					<div className={styles.header}>
						<BsCheckLg className={styles.icon} />{' '}
						<h2 className={styles.value}>2131</h2>
					</div>
					<h3>Tasks Completed</h3>
				</div>
				<div
					className={styles.pendingTasks}
					data-tilt
					data-tilt-reverse="true"
				>
					<div className={styles.header}>
						<h2 className={styles.value}>13</h2>
						<MdPendingActions className={styles.icon} />
					</div>
					<h3>Pending Tasks</h3>
				</div>
				<div
					className={styles.totalBoards}
					data-tilt
					data-tilt-reverse="true"
				>
					<div className={styles.header}>
						<MdOutlineLibraryBooks className={styles.icon} />
						<h3>Boards</h3>
					</div>
					<h2 className={styles.value}>462</h2>
				</div>
				<div
					className={styles.totalWorkspaces}
					data-tilt
					data-tilt-reverse="true"
				>
					<h3>Workspaces</h3>
					<div className={styles.bottom}>
						<HiOutlineDocument className={styles.icon} />
						<h2 className={styles.value}>128</h2>
					</div>
				</div>
				<div
					className={styles.totalMessages}
					data-tilt
					data-tilt-reverse="true"
				>
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
