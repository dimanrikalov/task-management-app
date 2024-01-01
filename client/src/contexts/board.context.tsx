import { createContext, useContext } from "react";
import { IBoardData, useFetchBoardData } from "@/hooks/useFetchBoardData";
import { IUser } from "@/components/AddColleagueInput/AddColleagueInput";

interface IBoardContext {
    isLoading: boolean;
    boardData: IBoardData | null,
    usersWithBoardAccess: IUser[]
    setBoardData: React.Dispatch<React.SetStateAction<IBoardData | null>>
}

const BoardContext = createContext<any>(null);

export const useBoardContext = () => useContext<IBoardContext>(BoardContext);

export const BoardContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { boardData, isLoading, usersWithBoardAccess, setBoardData } = useFetchBoardData();

    const value = {
        isLoading,
        boardData,
        setBoardData,
        usersWithBoardAccess
    }

    return (
        <BoardContext.Provider value={value}>
            {children}
        </BoardContext.Provider>
    );
}