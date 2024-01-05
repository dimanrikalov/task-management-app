import { setErrorMessageAsync } from '@/app/errorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useWorkspaceContext } from '@/contexts/workspace.context';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { METHODS, WORKSPACE_ENDPOINTS, request } from '@/utils/requester';
import { EDIT_COLLEAGUE_METHOD } from '@/views/WorkspaceView/Workspace.viewmodel';

export const useEditWorkspaceColleagues = () => {
    const dispatch = useAppDispatch();
    const { accessToken } = useAppSelector((state) => state.user);
    const { workspaceData, setWorkspaceData } = useWorkspaceContext();

    const editWorkspaceColleague = async (
        colleague: IUser,
        method: EDIT_COLLEAGUE_METHOD
    ) => {
        if (!workspaceData) {
            console.log('No workspace data!');
            return;
        }

        try {
            await request({
                method,
                accessToken,
                body: { colleagueId: colleague.id },
                endpoint: WORKSPACE_ENDPOINTS.COLLEAGUES(workspaceData.id)
            });
        } catch (err: any) {
            console.log(err.message);
            dispatch(setErrorMessageAsync(err.message));
        }
    };

    const addWorkspaceColleague = async (colleague: IUser) => {
        if (!workspaceData) return;

        await editWorkspaceColleague(colleague, METHODS.POST);
        setWorkspaceData((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                workspaceUsers: [...prev.workspaceUsers, colleague]
            };
        });
    };

    const removeWorkspaceColleague = async (colleague: IUser) => {
        if (!workspaceData) return;

        await editWorkspaceColleague(colleague, METHODS.DELETE);
        setWorkspaceData((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                workspaceUsers: [
                    ...prev.workspaceUsers.filter(
                        (col) => col.id !== colleague.id
                    )
                ]
            };
        });
    };

    return {
        addWorkspaceColleague,
        removeWorkspaceColleague
    };
};
