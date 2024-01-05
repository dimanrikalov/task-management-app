import {
    request,
    METHODS,
    BOARD_ENDPOINTS,
    WORKSPACE_ENDPOINTS
} from '@/utils/requester';
import { useEffect, useState } from 'react';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { ENTRIES_TYPES } from '@/views/HomeView/Home.viewmodel';

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
    const dispatch = useAppDispatch();
    const [isLoadingWorkspaces, setIsLoadingWorkspaces] =
        useState<boolean>(true);
    const [isLoadingBoards, setIsLoadingBoards] = useState<boolean>(true);
    const { accessToken } = useAppSelector((state) => state.user);
    const [lists, setLists] = useState<ILists>({
        boards: null,
        workspaces: null
    });

    //fetching boards
    useEffect(() => {
        setIsLoadingBoards(true);
        fetchEntries(ENTRIES_TYPES.BOARDS);
    }, [accessToken]);

    //fetching workspaces
    useEffect(() => {
        setIsLoadingWorkspaces(true);
        fetchEntries(ENTRIES_TYPES.WORKSPACES);
    }, [accessToken]);

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
            dispatch(setErrorMessageAsync(err.message));
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
