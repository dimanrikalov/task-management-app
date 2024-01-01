import { useState } from 'react';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { setCallForRefresh } from '@/app/taskModalSlice';
import { useBoardContext } from '@/contexts/board.context';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { BOARD_ENDPOINTS, METHODS, request } from '@/utils/requester';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { EDIT_COLLEAGUE_METHOD } from '@/views/WorkspaceView/Workspace.viewmodel';

export const useEditBoardColleagues = () => {
	const dispatch = useAppDispatch();
	const { boardData } = useBoardContext();
	const { accessToken } = useAppSelector((state) => state.user);
	const [isEditBoardUsersModalOpen, setIsEditBoardUsersModalOpen] =
		useState(false);

	const toggleIsEditBoardUsersModalOpen = () => {
		setIsEditBoardUsersModalOpen((prev) => !prev);
	};

	const editBoardColleague = async (
		colleague: IUser,
		method: EDIT_COLLEAGUE_METHOD
	) => {
		if (!boardData) {
			console.log('No board data!');
			return;
		}
		try {
			await request({
				method,
				accessToken,
				body: { colleagueId: colleague.id },
				endpoint: BOARD_ENDPOINTS.COLLEAGUES(boardData.id),
			});
		} catch (err: any) {
			console.log(err.message);
			dispatch(setErrorMessageAsync(err.message));
		}
	};

	const addBoardColleague = async (colleague: IUser) => {
		await editBoardColleague(colleague, METHODS.POST);
		dispatch(setCallForRefresh({ callForRefresh: true }));
	};

	const removeBoardColleague = async (colleague: IUser) => {
		await editBoardColleague(colleague, METHODS.DELETE);
		dispatch(setCallForRefresh({ callForRefresh: true }));
	};

	return {
		addBoardColleague,
		removeBoardColleague,
		isEditBoardUsersModalOpen,
		toggleIsEditBoardUsersModalOpen,
	};
};
