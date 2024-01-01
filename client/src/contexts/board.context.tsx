import { createContext, useContext } from "react";
import { IUser } from "@/components/AddColleagueInput/AddColleagueInput";
import { IBoardData, useFetchBoardData } from "@/hooks/useFetchBoardData";

interface IBoardContext {
    isLoading: boolean;
    workspaceUsers: IUser[];
    boardData: IBoardData | null;
    setWorkspaceUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
    setBoardData: React.Dispatch<React.SetStateAction<IBoardData | null>>;
}

const BoardContext = createContext<any>(null);

export const useBoardContext = () => useContext<IBoardContext>(BoardContext);

export const BoardContextProvider:
    React.FC<{ children: React.ReactNode }> =
    ({ children }) => {
        const data = useFetchBoardData();

        return (
            <BoardContext.Provider value={data}>
                {children}
            </BoardContext.Provider>
        );
    }