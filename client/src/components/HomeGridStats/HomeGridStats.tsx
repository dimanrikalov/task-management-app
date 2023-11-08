import { BsCheckLg } from 'react-icons/bs';
import styles from './homeGridStats.module.css';
import { LuMessageSquare } from 'react-icons/lu';
import { MdOutlineLibraryBooks, MdPendingActions } from 'react-icons/md';
import { HiOutlineDocument } from 'react-icons/hi';

export const HomeGridStats = () => {
	return (
		<div className={styles.grid}>
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
					<MdOutlineLibraryBooks className={styles.icon}/>
					<h3>Boards</h3>
				</div>
				<h2 className={styles.value}>462</h2>
			</div>
			<div className={styles.totalWorkspaces}>
				<h3>Total Boards</h3>
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
	);
};
