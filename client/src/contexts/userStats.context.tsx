import { useErrorContext } from './error.context';
import { useSocketConnection } from './socketConnection.context';
import { IUserContextSecure, useUserContext } from './user.context';
import { METHODS, USER_ENDPOINTS, request } from '../utils/requester';
import { createContext, useContext, useEffect, useState } from 'react';

interface IUserStats {
	hoursSpent: number;
	boardsCount: number;
	columnsCount: number;
	minutesSpent: number;
	messagesCount: number;
	stepsCompleted: number;
	workspacesCount: number;
	pendingTasksCount: number;
	completedTasksCount: number;
}

const initialStats = {
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

interface IUserStatsContext {
	isLoading: boolean;
	userStats: IUserStats;
}

const UserStatsContext = createContext<IUserStatsContext>({
	isLoading: true,
	userStats: initialStats
});

export const useUserStatsContext = () =>
	useContext<IUserStatsContext>(UserStatsContext);

export const UserStatsContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { showError } = useErrorContext();
	const { socket } = useSocketConnection();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { accessToken } = useUserContext() as IUserContextSecure;
	const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);
	const [userStats, setUserStats] = useState<IUserStats>(initialStats);

	useEffect(() => {
		if (!socket) return;

		const refetchStats = () => {
			console.log('updating stats')
			setShouldRefetch(true);
		}

		socket.onAny(refetchStats)

		return () => {
			socket.offAny(refetchStats)
		}

	}, [socket]);


	useEffect(() => {
		if (!shouldRefetch) return;

		const fetchUserStats = async () => {
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
		};

		fetchUserStats();
		setIsLoading(false);
		setShouldRefetch(false);
	}, [shouldRefetch]);

	const value = {
		isLoading,
		userStats
	};

	return (
		<UserStatsContext.Provider value={value}>
			{children}
		</UserStatsContext.Provider>
	);
};
