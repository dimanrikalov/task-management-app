import { generateImgUrl } from '@/utils';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useErrorContext } from '../contexts/error.context';
import { IDetailedWorkspace } from '../contexts/workspace.context';
import { METHODS, WORKSPACE_ENDPOINTS, request } from '../utils/requester';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';

export const useFetchWorkspaceData = () => {
	const { pathname } = useLocation();
	const { showError } = useErrorContext();
	const [workspaceData, setWorkspaceData] =
		useState<IDetailedWorkspace | null>(null);
	const workspaceId = Number(pathname.split('/').pop());
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { data: userData, accessToken } =
		useUserContext() as IUserContextSecure;

	useEffect(() => {
		const fetchWorkspace = async () => {
			setIsLoading(true);
			try {
				const workspaceData = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: WORKSPACE_ENDPOINTS.DETAILS(workspaceId)
				})) as IDetailedWorkspace;

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

				workspaceUsers.unshift({
					username: 'Me',
					id: userData.id,
					email: userData.email,
					profileImagePath: userData.profileImagePath
				});

				workspaceData.workspaceUsers = workspaceUsers;

				setWorkspaceData(workspaceData);
			} catch (err: any) {
				console.log(err.message);
				showError(err.message);
			}
			setIsLoading(false);
		};

		fetchWorkspace();
	}, []);

	return {
		isLoading,
		workspaceData,
		setWorkspaceData
	};
};
