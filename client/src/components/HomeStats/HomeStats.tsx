import { BsCheckLg } from 'react-icons/bs';
import styles from './homeStats.module.css';
import { LuMessageSquare } from 'react-icons/lu';
import { HiOutlineDocument } from 'react-icons/hi';
import { IUserStats } from '@/views/HomeView/Home.viewmodel';
import { MdOutlineLibraryBooks, MdPendingActions } from 'react-icons/md';

interface IHomeStatsProps {
    userStats: IUserStats
}

export const HomeStats = ({ userStats }: IHomeStatsProps) => {
    return (
        <>
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
        </>
    )
}