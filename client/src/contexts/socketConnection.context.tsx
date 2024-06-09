import { Socket, io } from 'socket.io-client';
import { useUserContext } from './user.context';
import { createContext, useContext, useEffect, useState } from 'react';

export enum SOCKET_EVENTS {
	TASK_MOVED = 'taskMoved',
	MESSAGE_SENT = 'messageSent',
	TASK_CREATED = 'taskCreated',
	TASK_DELETED = 'taskDeleted',
	COLUMN_MOVED = 'columnMoved',
	USER_CREATED = 'userCreated',
	USER_DELETED = 'userDeleted',
	TASK_MODIFIED = 'taskModifed',
	NOTIFICATION = 'notification',
	BOARD_CREATED = 'boardCreated',
	BOARD_RENAMED = 'boardRenamed',
	BOARD_DELETED = 'boardDeleted',
	COLUMN_RENAMED = 'columnRenamed',
	COLUMN_DELETED = 'columnDeleted',
	COLUMN_CREATED = 'columnCreated',
	WORKSPACE_CREATED = 'workspaceCreated',
	WORKSPACE_RENAMED = 'workspaceRenamed',
	WORKSPACE_DELETED = 'workspaceDeleted',
	BOARD_COLLEAGUE_ADDED = 'boardColleagueAdded',
	BOARD_COLLEAGUE_DELETED = 'boardColleagueDeleted',
	WORKSPACE_COLLEAGUE_ADDED = 'workspaceColleagueAdded',
	WORKSPACE_COLLEAGUE_DELETED = 'workspaceColleagueDeleted'
}

interface ISocketConnectionContext {
	socket: Socket<any> | null;
}

const SocketConnectionContext = createContext<ISocketConnectionContext>({
	socket: null
});

export const useSocketConnection = () =>
	useContext<ISocketConnectionContext>(SocketConnectionContext);

export const SocketConnectionProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { data, accessToken } = useUserContext();
	const [socket, setSocket] = useState<Socket<any> | null>(null);

	// socket.io inital subscription to all accessible entries inside (workspaces, boards) collections
	useEffect(() => {
		if (!data || !accessToken) {
			if (!socket) return;
			console.log('disconnecting');
			socket.disconnect();
			return;
		}

		const newSocket = io(import.meta.env.VITE_SERVER_URL, {
			extraHeaders: {
				Authorization: accessToken,
			},
		});

		setSocket(newSocket);

		newSocket.on('connected', (data) => {
			console.log('Server says:', data.message);
			console.log('User information:', data.user);
		});

		return () => {
			// Cleanup logic if needed
			newSocket.disconnect();
		};
	}, [data, accessToken]);

	const contextValue: ISocketConnectionContext = {
		socket,
	};

	return (
		<SocketConnectionContext.Provider value={contextValue}>
			{children}
		</SocketConnectionContext.Provider>
	);
};
