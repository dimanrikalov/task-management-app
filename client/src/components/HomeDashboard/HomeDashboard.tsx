import {
    IHomeBoardEntry,
    IHomeWorkspaceEntry
} from '@/hooks/useFetchHomeLists';
import styles from './homeDashboard.module.css';
import { HomeList } from '../HomeList/HomeList';
import { HomeStats } from '../HomeStats/HomeStats';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';
import { ISearchInputs, ENTRIES_TYPES } from '@/views/HomeView/Home.viewmodel';

interface IHomeGridStatsProps {
    isLoadingBoards: boolean;
    boards: IHomeBoardEntry[];
    searchInputs: ISearchInputs;
    isLoadingWorkspaces: boolean;
    workspaces: IHomeWorkspaceEntry[];
    filterHandler(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const HomeDashboard = ({
    boards,
    workspaces,
    searchInputs,
    filterHandler,
    isLoadingBoards,
    isLoadingWorkspaces
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
                        isLoading={isLoadingBoards}
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
                        isLoading={isLoadingWorkspaces}
                        type={ENTRIES_TYPES.WORKSPACES}
                    />
                </div>

                <HomeStats />
            </div>
        </div>
    );
};
