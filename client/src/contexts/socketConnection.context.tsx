import { Socket, io } from 'socket.io-client';
import { useUserContext } from './user.context';
import { createContext, useContext, useEffect, useState } from 'react';


export enum SOCKET_EVENTS {
	ANY = '*',
	USER_CREATED = 'userCreated',
	NOTIFICATION = 'notification',
	BOARD_CREATED = 'boardCreated',
	BOARD_DELETED = 'boardDeleteEd',
	WORKSPACE_CREATED = 'workspaceCreated',
	WORKSPACE_DELETED = 'workspaceDeleted',
	WORKSPACE_RENAMED = 'workspaceRenamed',
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
		if (!data) return;
		console.log('useEffect executed');

		const newSocket = io(import.meta.env.VITE_SERVER_URL, {
			extraHeaders: {
				Authorization: accessToken,
			},
		});

		setSocket(newSocket);

		newSocket.on('connected', (data) => {
			//why is it executing twice
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
