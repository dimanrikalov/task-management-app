import classNames from 'classnames';
import { BiColumns } from "react-icons/bi";
import { HomeStat } from '../HomeStat/HomeStat';
import { LuMessageSquare } from 'react-icons/lu';
import styles from './bottomRightStats.module.css';
import { HiOutlineDocument } from "react-icons/hi";
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { useUserStatsContext } from '../../contexts/userStats.context';


export const BottomRightStats = () => {
    const { userStats, isLoading } = useUserStatsContext();

    return (
        <div className={styles.background}>
            <div className={classNames(styles.card, styles.workspacesCreated)}>
                <HomeStat
                    title={'Workspaces'}
                    isLoading={isLoading}
                    value={userStats.workspacesCount}
                    icon={<MdOutlineLibraryBooks className={styles.icon} />}
                />
            </div>
            <div className={classNames(styles.card, styles.boardsCreated)}>
                <HomeStat
                    title={'Boards'}
                    isLoading={isLoading}
                    value={userStats.boardsCount}
                    icon={<HiOutlineDocument className={styles.icon} />}
                />
            </div>
            <div className={classNames(styles.card, styles.messages)}>
                <HomeStat
                    title={'Messages'}
                    isLoading={isLoading}
                    value={userStats.messagesCount}
                    icon={<LuMessageSquare className={styles.icon} />}
                />
            </div>
            <div className={classNames(styles.card, styles.columns)}>
                <HomeStat
                    title={'Columns'}
                    isLoading={isLoading}
                    value={userStats.columnsCount}
                    icon={<BiColumns className={styles.icon} />}
                />
            </div>
        </div>
    );
};
