import {
    IHomeBoardEntry,
    IHomeWorkspaceEntry
} from '@/hooks/useFetchHomeLists';
import styles from './homeList.module.css';
import { useNavigate } from 'react-router-dom';
import { HomeCard } from '../HomeCard/HomeCard';
import { IntroInput } from '../IntroInput/IntroInput';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { ENTRIES_TYPES, ISearchInputs } from '@/views/HomeView/Home.viewmodel';

type TEntries = IHomeWorkspaceEntry[] | IHomeBoardEntry[];

export interface IHomeListProps {
    entries: TEntries;
    isLoading: boolean;
    type: ENTRIES_TYPES;
    searchInputs: ISearchInputs;
    filterHandler(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const HomeList = ({
    type,
    entries,
    isLoading,
    searchInputs,
    filterHandler
}: IHomeListProps) => {
    const navigate = useNavigate();

    const extractSubtitle = (entry: IHomeBoardEntry | IHomeWorkspaceEntry) => {
        if ('ownerName' in entry) {
            return entry.ownerName;
        } else {
            return entry.workspaceName;
        }
    };

    return (
        <div className={styles.background}>
            <div className={styles.filter}>
                <h3>{type === ENTRIES_TYPES.BOARDS ? 'Boards' : 'Workspaces'}</h3>
                <div className={styles.filterInput}>
                    <IntroInput
                        type={'text'}
                        onChange={filterHandler}
                        name={type === ENTRIES_TYPES.BOARDS ? 'searchBoards' : 'searchWorkspaces'}
                        placeholder={`Filter ${type === ENTRIES_TYPES.BOARDS ? 'board' : 'workspace'}s`}
                        value={type === ENTRIES_TYPES.BOARDS ? searchInputs.searchBoards : searchInputs.searchWorkspaces}
                    />
                </div>
            </div>
            {isLoading ? (
                <div className={styles.noEntriesContainer}>
                    <LoadingOverlay />
                </div>
            ) : entries.length > 0 ? (
                <div className={styles.list}>
                    {
                        entries.map((entry) => (
                            <HomeCard
                                key={entry.id}
                                title={entry.name}
                                userCount={entry.usersCount}
                                subtitle={extractSubtitle(entry)}
                                onClick={() => navigate(`/${type}/${entry.id}`)}
                            />
                        ))
                    }
                </div>
            ) : (
                <div className={styles.noEntriesContainer}>
                    <div className={styles.noEntries}>
                        <h2 className={styles.noEntriesMsg}>
                            {`No ${type} to show yet...`}
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
};
