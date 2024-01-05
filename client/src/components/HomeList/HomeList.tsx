import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { HomeCard } from '../HomeCard/HomeCard';
import styles from '../HomeDashboard/homeDashboard.module.css';
import { ENTRIES_TYPES } from '@/views/HomeView/Home.viewmodel';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import {
    IHomeBoardEntry,
    IHomeWorkspaceEntry
} from '@/hooks/useFetchHomeLists';

type TEntries = IHomeWorkspaceEntry[] | IHomeBoardEntry[];

interface IHomeListProps {
    entries: TEntries;
    isLoading: boolean;
    type: ENTRIES_TYPES;
}

export const HomeList = ({ entries, isLoading, type }: IHomeListProps) => {
    const navigate = useNavigate();

    const extractSubtitle = (entry: IHomeBoardEntry | IHomeWorkspaceEntry) => {
        if ('ownerName' in entry) {
            return entry.ownerName;
        } else {
            return entry.workspaceName;
        }
    };

    return (
        <div
            className={classNames(
                styles.list,
                type === ENTRIES_TYPES.BOARDS && styles.boardsContainer
            )}
        >
            {isLoading ? (
                <div className={styles.noEntriesContainer}>
                    <LoadingOverlay />
                </div>
            ) : entries.length > 0 ? (
                entries.map((entry) => (
                    <HomeCard
                        key={entry.id}
                        title={entry.name}
                        userCount={entry.usersCount}
                        subtitle={extractSubtitle(entry)}
                        isBoardBtn={type === ENTRIES_TYPES.BOARDS}
                        onClick={() => navigate(`/${type}/${entry.id}`)}
                        isWorkspaceBtn={type === ENTRIES_TYPES.WORKSPACES}
                    />
                ))
            ) : (
                <div className={styles.noEntriesContainer}>
                    <div className={styles.noEntries}>
                        <h1 className={styles.noEntriesMsg}>
                            {`No ${type} to show yet...`}
                        </h1>
                    </div>
                </div>
            )}
        </div>
    );
};
