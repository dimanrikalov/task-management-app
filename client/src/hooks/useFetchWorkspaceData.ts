import {
	SOCKET_EVENTS,
	useSocketConnection
} from '@/contexts/socketConnection.context';
import { generateImgUrl } from '@/utils';
import { useEffect, useState } from 'react';
import { languages, useTranslate } from './useTranslate';
import { useLocation, useNavigate } from 'react-router-dom';
import { useErrorContext } from '../contexts/error.context';
import { IDetailedWorkspace } from '../contexts/workspace.context';
import { METHODS, WORKSPACE_ENDPOINTS, request } from '../utils/requester';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';

export const useFetchWorkspaceData = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { language } = useTranslate();
	const { showError } = useErrorContext();
	const { socket } = useSocketConnection();
	const [workspaceData, setWorkspaceData] =
		useState<IDetailedWorkspace | null>(null);
	const workspaceId = Number(pathname.split('/').pop());
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);
	const { data: userData, accessToken } =
		useUserContext() as IUserContextSecure;

	useEffect(() => {
		if (!socket) return;

		const handleWorkspaceModified = () => {
			console.log('updating workspace');
			setShouldRefetch(true);
		};

		//USER EVENT
		socket.on(SOCKET_EVENTS.USER_DELETED, handleWorkspaceModified);

		//BOARD EVENTS
		socket.on(SOCKET_EVENTS.BOARD_CREATED, handleWorkspaceModified);
		socket.on(SOCKET_EVENTS.BOARD_DELETED, handleWorkspaceModified);
		socket.on(SOCKET_EVENTS.BOARD_RENAMED, handleWorkspaceModified);

		//WORKSPACE EVENTS
		socket.on(
			SOCKET_EVENTS.WORKSPACE_COLLEAGUE_ADDED,
			handleWorkspaceModified
		);
		socket.on(
			SOCKET_EVENTS.WORKSPACE_COLLEAGUE_DELETED,
			handleWorkspaceModified
		);

		socket.on(SOCKET_EVENTS.WORKSPACE_DELETED, handleWorkspaceModified);
		socket.on(SOCKET_EVENTS.WORKSPACE_RENAMED, handleWorkspaceModified);

		return () => {
			//USER EVENT
			socket.off(SOCKET_EVENTS.USER_DELETED, handleWorkspaceModified);

			//BOARD EVENTS
			socket.off(SOCKET_EVENTS.BOARD_CREATED, handleWorkspaceModified);
			socket.off(SOCKET_EVENTS.BOARD_DELETED, handleWorkspaceModified);
			socket.off(SOCKET_EVENTS.BOARD_RENAMED, handleWorkspaceModified);

			//WORKSPACE EVENTS
			socket.off(
				SOCKET_EVENTS.WORKSPACE_COLLEAGUE_ADDED,
				handleWorkspaceModified
			);
			socket.off(
				SOCKET_EVENTS.WORKSPACE_COLLEAGUE_DELETED,
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
		};
	}, [socket]);

	useEffect(() => {
		if (!workspaceData) return;
		setIsLoading(false);
	}, [workspaceData]);

	useEffect(() => {
		if (!workspaceData) return;

		const oldUsername = language === 'bg' ? 'Me' : 'Аз';
		const username = language === 'bg' ? 'Аз' : 'Me';

		const workspaceUsers = workspaceData.workspaceUsers.map((user) => {
			if (user.username === oldUsername) {
				return { ...user, username };
			}

			return user;
		});

		setWorkspaceData((prev) => {
			if (!prev) return null;

			return { ...prev, workspaceUsers };
		});
	}, [language]);

	useEffect(() => {
		if (!shouldRefetch) return;

		const fetchWorkspace = async () => {
			try {
				const workspaceData = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: WORKSPACE_ENDPOINTS.DETAILS(workspaceId)
				})) as IDetailedWorkspace | { errorMessage: string };

				if ('errorMessage' in workspaceData) {
					throw new Error(
						`${workspaceData.errorMessage} 
						Check your notifications for 
						potential modifications to this workspace.`
					);
				}

				//add workspace owner to the users with access to the workspace, and filter out the currently logged user
				const workspaceUsers = [
					workspaceData.workspaceOwner,
					...workspaceData.workspaceUsers
				]
					.filter((user) => user.id !== userData.id)
					.map((user) => ({
						...user,
						profileImagePath: generateImgUrl(user.profileImagePath)
					}));

				/* 
					add the currently logged user as 'Me' on top of the list
					and directly give the profileImagePath as we have it loaded from the authGuard
				*/

				const Me = language === languages.en ? 'Me' : 'Аз';
				workspaceUsers.unshift({
					username: Me,
					id: userData.id,
					email: userData.email,
					profileImagePath: userData.profileImagePath
				});

				workspaceData.workspaceUsers = workspaceUsers;

				setWorkspaceData(workspaceData);
			} catch (err: any) {
				console.log(err.message);
				showError(err.message);
				navigate(-1);
			}
			setIsLoading(false);
		};

		if (!workspaceData) {
			setIsLoading(true);
		}

		fetchWorkspace();
		setShouldRefetch(false);
	}, [shouldRefetch]);

	return {
		isLoading,
		workspaceData,
		setWorkspaceData
	};
};
