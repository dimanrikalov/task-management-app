import {
    ENTRIES_TYPES,
    IHomeBoardEntry,
    IHomeWorkspaceEntry
} from "@/views/HomeView/Home.viewmodel"
import { useNavigate } from "react-router-dom";
import { HomeCard } from "../HomeCard/HomeCard"
import styles from '../HomeDashboard/homeDashboard.module.css';

type TEntries = IHomeWorkspaceEntry[] | IHomeBoardEntry[];


interface IHomeListProps {
    entries: TEntries;
    type: ENTRIES_TYPES;
}

export const HomeList = ({ entries, type }: IHomeListProps) => {
    const navigate = useNavigate();

    const extractSubtitle = (entry: IHomeBoardEntry | IHomeWorkspaceEntry) => {
        if ('ownerName' in entry) {
            return entry.ownerName;
        } else {
            return entry.workspaceName
        }
    }

    return (
        <div className={styles.list}>
            {
                entries.length > 0 ?
                    entries.map((entry) =>
                        <HomeCard
                            key={entry.id}
                            isWorkspaceBtn={true}
                            title={entry.name}
                            userCount={entry.usersCount}
                            subtitle={extractSubtitle(entry)}
                            onClick={() => navigate(`/${type}/${entry.id}`)}
                        />
                    ) :
                    <h1
                        className={
                            type === ENTRIES_TYPES.BOARDS ?
                                styles.noBoards : styles.noWorkspaces
                        }
                    >
                        {`You don't have access to any ${type} yet...`}
                    </h1>
            }
        </div>
    )
}