import { createContext, useContext } from "react";
import { useFetchWorkspaceData } from "@/hooks/useFetchWorkspaceData";
import { IUser } from "@/components/AddColleagueInput/AddColleagueInput";
import { IDetailedBoard } from "@/views/CreateBoardView/CreateBoard.viewmodel";


export interface IDetailedWorkspace {
    id: number;
    name: string;
    workspaceOwner: IUser;
    workspaceUsers: IUser[];
    boards: IDetailedBoard[];
}

interface IWorkspaceContext {
    isLoading: boolean;
    workspaceData: IDetailedWorkspace;
    setWorkspaceData: React.Dispatch<React.SetStateAction<IDetailedWorkspace | null>>;
}

const WorkspaceContext = createContext<any>(null);

export const useWorkspaceContext = () => useContext<IWorkspaceContext>(WorkspaceContext);

export const WorkspaceContextProvider:
    React.FC<{ children: React.ReactNode }> =
    ({ children }) => {
        const data = useFetchWorkspaceData();

        return (
            <WorkspaceContext.Provider value={data}>
                {children}
            </WorkspaceContext.Provider>
        );
    }