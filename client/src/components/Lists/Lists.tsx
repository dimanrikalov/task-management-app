import styles from './lists.module.css';
import { HomeList } from '../HomeList/HomeList';
import { ENTRIES_TYPES, ISearchInputs } from '../../views/HomeView/Home.viewmodel';
import { IHomeBoardEntry, IHomeWorkspaceEntry } from '../../hooks/useFetchHomeLists';


interface IListsProps {
    isLoadingBoard: boolean,
    boards: IHomeBoardEntry[],
    searchInputs: ISearchInputs,
    isLoadingWorkspaces: boolean
    workspaces: IHomeWorkspaceEntry[],
    filterHandler(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const Lists = ({
    boards,
    workspaces,
    searchInputs,
    filterHandler,
    isLoadingBoard,
    isLoadingWorkspaces
}: IListsProps) => {
    return (
        <div className={styles.background}>
            <HomeList
                entries={boards}
                searchInputs={searchInputs}
                isLoading={isLoadingBoard}
                type={ENTRIES_TYPES.BOARDS}
                filterHandler={filterHandler}
            />
            <HomeList
                entries={workspaces}
                searchInputs={searchInputs}
                filterHandler={filterHandler}
                isLoading={isLoadingWorkspaces}
                type={ENTRIES_TYPES.WORKSPACES}
            />
        </div>
    )
};