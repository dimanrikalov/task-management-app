import {
	request,
	METHODS,
	BOARD_ENDPOINTS,
	WORKSPACE_ENDPOINTS
} from '../utils/requester';
import {
	SOCKET_EVENTS,
	useSocketConnection
} from '@/contexts/socketConnection.context';
import { useEffect, useState } from 'react';
import { useErrorContext } from '../contexts/error.context';
import { ENTRIES_TYPES } from '../views/HomeView/Home.viewmodel';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';

export interface IHomeBoardEntry {
	id: number;
	name: string;
	usersCount: number;
	workspaceName: string;
}

export interface IHomeWorkspaceEntry {
	id: number;
	name: string;
	ownerName: string;
	usersCount: number;
}

export interface ILists {
	boards: IHomeBoardEntry[] | null;
	workspaces: IHomeWorkspaceEntry[] | null;
}

export const useFetchHomeLists = () => {
	const { showError } = useErrorContext();
	const { socket } = useSocketConnection();
	const { accessToken } = useUserContext() as IUserContextSecure;
	const [isLoadingBoards, setIsLoadingBoards] = useState<boolean>(true);
	const [shouldFetchWorkspaces, setShouldFetchWorkspaces] =
		useState<boolean>(true);
	const [shouldFetchBoards, setShouldFetchBoards] = useState<boolean>(true);
	const [isLoadingWorkspaces, setIsLoadingWorkspaces] =
		useState<boolean>(true);
	const [lists, setLists] = useState<ILists>({
		boards: null,
		workspaces: null
	});

	useEffect(() => {
		if (!socket) return;

		const handleWorkspaceModified = () => {
			setShouldFetchWorkspaces(true);
		};

		const handleBoardModified = () => {
			setShouldFetchBoards(true);
		};

		socket.on(
			SOCKET_EVENTS.WORKSPACE_COLLEAGUE_ADDED,
			handleWorkspaceModified
		);
		socket.on(
			SOCKET_EVENTS.WORKSPACE_COLLEAGUE_DELETED,
			handleWorkspaceModified
		);
		socket.on(SOCKET_EVENTS.WORKSPACE_CREATED, handleWorkspaceModified);
		socket.on(SOCKET_EVENTS.WORKSPACE_DELETED, handleWorkspaceModified);
		socket.on(SOCKET_EVENTS.WORKSPACE_RENAMED, handleWorkspaceModified);

		socket.on(SOCKET_EVENTS.BOARD_CREATED, handleBoardModified);

		return () => {
			socket.off(
				SOCKET_EVENTS.WORKSPACE_CREATED,
				handleWorkspaceModified
			);
			socket.off(
				SOCKET_EVENTS.WORKSPACE_DELETED,
				handleWorkspaceModified
			);
			socket.off(
				SOCKET_EVENTS.WORKSPACE_RENAMED,
				handleWorkspaceModified
			);
			socket.off(
				SOCKET_EVENTS.WORKSPACE_COLLEAGUE_ADDED,
				handleWorkspaceModified
			);
			socket.off(
				SOCKET_EVENTS.WORKSPACE_COLLEAGUE_DELETED,
				handleWorkspaceModified
			);

			socket.off(SOCKET_EVENTS.BOARD_CREATED, handleBoardModified);
		};
	}, [socket]);

	//fetching boards
	useEffect(() => {
		if (!shouldFetchBoards) return;
		setIsLoadingBoards(true);
		fetchEntries(ENTRIES_TYPES.BOARDS);
		setShouldFetchBoards(false);
	}, [shouldFetchBoards]);

	//fetching workspaces
	useEffect(() => {
		if (!shouldFetchWorkspaces) return;
		setIsLoadingWorkspaces(true);
		fetchEntries(ENTRIES_TYPES.WORKSPACES);
		setShouldFetchWorkspaces(false);
	}, [shouldFetchWorkspaces]);

	const fetchEntries = async (entries: ENTRIES_TYPES) => {
		try {
			const data = await request({
				accessToken,
				method: METHODS.GET,
				endpoint:
					entries === ENTRIES_TYPES.BOARDS
						? BOARD_ENDPOINTS.BASE
						: WORKSPACE_ENDPOINTS.BASE
			});

			setLists((prev) => ({ ...prev, [entries]: data }));
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	};

	return {
		lists,
		isLoadingBoards,
		setIsLoadingBoards,
		isLoadingWorkspaces,
		setIsLoadingWorkspaces
	};
};
