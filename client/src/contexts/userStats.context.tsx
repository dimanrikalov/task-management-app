import { useErrorContext } from "./error.context";
import { IUserContextSecure, useUserContext } from "./user.context";
import { METHODS, USER_ENDPOINTS, request } from "../utils/requester";
import { createContext, useContext, useEffect, useState } from "react";

interface IUserStats {
    hoursSpent: number,
    boardsCount: number,
    columnsCount: number,
    minutesSpent: number,
    messagesCount: number,
    stepsCompleted: number,
    workspacesCount: number,
    pendingTasksCount: number,
    completedTasksCount: number
}

interface IUserStatsContext {
    isLoading: boolean;
    userStats: IUserStats
}


const UserStatsContext = createContext<IUserStatsContext>({
    isLoading: true,
    userStats: {
        hoursSpent: -1,
        boardsCount: -1,
        columnsCount: -1,
        minutesSpent: -1,
        messagesCount: -1,
        stepsCompleted: -1,
        workspacesCount: -1,
        pendingTasksCount: -1,
        completedTasksCount: -1
    }
});

export const useUserStatsContext = () => useContext<IUserStatsContext>(UserStatsContext);


export const UserStatsContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const { showError } = useErrorContext();
    const { accessToken } = useUserContext() as IUserContextSecure;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userStats, setUserStats] = useState<IUserStats>({
        hoursSpent: -1,
        boardsCount: -1,
        columnsCount: -1,
        minutesSpent: -1,
        messagesCount: -1,
        stepsCompleted: -1,
        workspacesCount: -1,
        pendingTasksCount: -1,
        completedTasksCount: -1
    });

    useEffect(() => {
        const fetchUserStats = async () => {
            setIsLoading(true);
            try {
                const data = await request({
                    accessToken,
                    method: METHODS.GET,
                    endpoint: USER_ENDPOINTS.STATS
                });

                setUserStats(data);
            } catch (err: any) {
                console.log(err.message);
                showError(err.message);
            }
            setIsLoading(false);
        };

        fetchUserStats();
    }, []);

    const value = {
        isLoading,
        userStats
    }

    return (
        <UserStatsContext.Provider value={value}>{children}</UserStatsContext.Provider>
    );
};
