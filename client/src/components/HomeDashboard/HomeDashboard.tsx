
import { Lists } from '../Lists/Lists';
import styles from './homeDashboard.module.css';
import { Operations } from '../Operations/Operations';
import { ISearchInputs } from '../../views/HomeView/Home.viewmodel';
import { BottomLeftStats } from '../BottomLeftStats/BottomLeftStats';
import { BottomRightStats } from '../BottomRightStats/BottomRightStats';
import { IHomeBoardEntry, IHomeWorkspaceEntry } from '../../hooks/useFetchHomeLists';

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
            <div className={styles.operations}>
                <Operations />
            </div>

            <div className={styles.lists}>
                <Lists
                    boards={boards}
                    workspaces={workspaces}
                    searchInputs={searchInputs}
                    filterHandler={filterHandler}
                    isLoadingBoard={isLoadingBoards}
                    isLoadingWorkspaces={isLoadingWorkspaces}
                />
            </div>
            <div className={styles.bottomLeftStats}>
                <BottomLeftStats />
            </div>
            <div className={styles.bottomRightStats}>
                <BottomRightStats />
            </div>

        </div>
    );
};
