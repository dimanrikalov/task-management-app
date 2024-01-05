import { useState } from 'react';
import { ROUTES } from '@/router';
import { useNavigate } from 'react-router-dom';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { setWorkspaceName } from '@/app/inputValuesSlice';
import { toggleCreateBoardModal } from '@/app/modalsSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useWorkspaceContext } from '@/contexts/workspace.context';
import { METHODS, WORKSPACE_ENDPOINTS, request } from '@/utils/requester';

export const useEditWorkspace = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { accessToken } = useAppSelector((state) => state.user);
    const { workspaceData, setWorkspaceData } = useWorkspaceContext();
    const [isInputModeOn, setIsInputModeOn] = useState<boolean>(false);
    const [workspaceNameInput, setWorkspaceNameInput] = useState<string>('');

    const toggleIsCreateBoardModalOpen = () => {
        if (!workspaceData) return;
        dispatch(toggleCreateBoardModal());
        dispatch(setWorkspaceName({ workspaceName: workspaceData.name }));
    };

    const handleWorkspaceNameInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setWorkspaceNameInput(e.target.value);
    };

    const handleWorkspaceNameChange = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (!workspaceData) return;

        if (workspaceData.name === workspaceNameInput) {
            setIsInputModeOn(false);
            return;
        }

        try {
            const data = await request({
                accessToken,
                method: METHODS.PUT,
                endpoint: WORKSPACE_ENDPOINTS.RENAME(workspaceData.id),
                body: {
                    newName: workspaceNameInput.trim()
                }
            });

            if (data.errorMessage) {
                throw new Error(data.errorMessage);
            }

            setWorkspaceData((prev) => {
                if (!prev) return null;

                return {
                    ...prev,
                    name: workspaceNameInput
                };
            });
        } catch (err: any) {
            console.log(err.message);
            dispatch(setErrorMessageAsync(err.message));
        }
        setIsInputModeOn(false);
    };

    const deleteWorkspace = async () => {
        if (!workspaceData) {
            throw new Error('Workspace data missing!');
        }
        try {
            await request({
                accessToken,
                method: METHODS.DELETE,
                endpoint: WORKSPACE_ENDPOINTS.WORKSPACE(workspaceData.id)
            });
            navigate(ROUTES.DASHBOARD, { replace: true });
        } catch (err: any) {
            console.log(err.message);
            dispatch(setErrorMessageAsync(err.message));
        }
    };

    const toggleIsInputModeOn = () => {
        if (!workspaceData) return;
        setIsInputModeOn((prev) => !prev);
        setWorkspaceNameInput(workspaceData.name);
    };

    return {
        isInputModeOn,
        deleteWorkspace,
        workspaceNameInput,
        toggleIsInputModeOn,
        handleWorkspaceNameChange,
        toggleIsCreateBoardModalOpen,
        handleWorkspaceNameInputChange
    };
};
