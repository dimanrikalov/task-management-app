import { BsCheckLg } from 'react-icons/bs';
import styles from './homeStats.module.css';
import { LuMessageSquare } from 'react-icons/lu';
import { HiOutlineDocument } from 'react-icons/hi';
import { IOutletContext } from '@/guards/authGuard';
import { useOutletContext } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';
import { ErrorContext, IErrorContext } from '@/contexts/ErrorContext';
import { MdOutlineLibraryBooks, MdPendingActions } from 'react-icons/md';

interface IUserStats {
    boardsCount: number;
    messagesCount: number;
    workspacesCount: number;
    pendingTasksCount: number;
    completedTasksCount: number;
}

interface IStatProps {
    stat: number;
    isLoading: boolean;
}

const Stat = ({ isLoading, stat }: IStatProps) => {
    return (
        <div className={styles.value}>
            {
                isLoading ?
                    <LoadingOverlay size={42} color="#fff" />
                    :
                    <h3>{stat}</h3>
            }
        </div>
    )
}

export const HomeStats = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { accessToken } = useOutletContext<IOutletContext>();
    const { setErrorMessage } = useContext<IErrorContext>(ErrorContext);
    const [userStats, setUserStats] = useState<IUserStats>({
        boardsCount: -1,
        messagesCount: -1,
        workspacesCount: -1,
        pendingTasksCount: -1,
        completedTasksCount: -1,
    });

    useEffect(() => {
        const fetchUserStats = async () => {
            setIsLoading(true);
            try {
                const data = await request({
                    accessToken,
                    method: METHODS.GET,
                    endpoint: USER_ENDPOINTS.STATS,
                });
                setUserStats(data);
            } catch (err: any) {
                console.log(err.message);
                setErrorMessage(err.message);
            }
            setIsLoading(false);
        };

        fetchUserStats();
    }, []);

    return (
        <>
            <div className={styles.completeTasks}>
                <div className={styles.header}>
                    <BsCheckLg className={styles.icon} />{' '}
                    <Stat isLoading={isLoading} stat={userStats.completedTasksCount} />
                </div>
                <h3 className={styles.statName}>Tasks Completed</h3>
            </div>
            <div className={styles.pendingTasks}>
                <div className={styles.header}>
                    <Stat isLoading={isLoading} stat={userStats.pendingTasksCount} />
                    <MdPendingActions className={styles.icon} />
                </div>
                <h3 className={styles.statName}>Pending Tasks</h3>
            </div>
            <div className={styles.totalBoards}>
                <div className={styles.header}>
                    <MdOutlineLibraryBooks className={styles.icon} />
                    <Stat isLoading={isLoading} stat={userStats.boardsCount} />
                </div>
                <h3 className={styles.statName}>Boards</h3>
            </div>
            <div className={styles.totalWorkspaces}>
                <h3 className={styles.statName}>Workspaces</h3>
                <div className={styles.bottom}>
                    <HiOutlineDocument className={styles.icon} />
                    <Stat isLoading={isLoading} stat={userStats.workspacesCount} />
                </div>
            </div>
            <div className={styles.totalMessages}>
                <h3 className={styles.statName}>Messages</h3>
                <div className={styles.bottom}>
                    <LuMessageSquare className={styles.icon} />
                    <Stat isLoading={isLoading} stat={userStats.messagesCount} />
                </div>
            </div>
        </>
    )
}