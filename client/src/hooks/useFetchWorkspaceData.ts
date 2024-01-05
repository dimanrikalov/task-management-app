import { useEffect, useState } from 'react';
import { IUserData } from '@/app/userSlice';
import { useLocation } from 'react-router-dom';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { IDetailedWorkspace } from '@/contexts/workspace.context';
import { METHODS, WORKSPACE_ENDPOINTS, request } from '@/utils/requester';

export const useFetchWorkspaceData = () => {
    const { pathname } = useLocation();
    const dispatch = useAppDispatch();
    const [workspaceData, setWorkspaceData] =
        useState<IDetailedWorkspace | null>(null);
    const workspaceId = Number(pathname.split('/').pop());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { data: userData, accessToken } = useAppSelector(
        (state) => state.user
    ) as { data: IUserData; accessToken: string };

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
                        profileImagePath: `data:image/png;base64,${user.profileImagePath}`
                    }));

                /* 
					add the currently logged user as 'Me' on top of the list
					and directly give the profileImagePath as we have it loaded from the authGuard
				*/

                workspaceUsers.unshift({
                    email: 'Me',
                    id: userData.id,
                    profileImagePath: userData.profileImagePath
                });

                workspaceData.workspaceUsers = workspaceUsers;

                setWorkspaceData(workspaceData);
            } catch (err: any) {
                console.log(err.message);
                dispatch(setErrorMessageAsync(err.message));
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
