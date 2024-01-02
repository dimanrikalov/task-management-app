import { useState } from 'react';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useBoardContext } from '@/contexts/board.context';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { BOARD_ENDPOINTS, METHODS, request } from '@/utils/requester';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { EDIT_COLLEAGUE_METHOD } from '@/views/WorkspaceView/Workspace.viewmodel';

export const useEditBoardColleagues = () => {
	const dispatch = useAppDispatch();
	const { boardData, setBoardData } = useBoardContext();
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
		try {
			if (!boardData) {
				throw new Error('No board data!');
			}

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
		if (!boardData) return;
		await editBoardColleague(colleague, METHODS.POST);
		setBoardData((prev) => {
			if (!prev) return null;

			return {
				...prev,
				boardUsers: [...prev.boardUsers, colleague],
			};
		});
	};

	const removeBoardColleague = async (colleague: IUser) => {
		if (!boardData) return;
		await editBoardColleague(colleague, METHODS.DELETE);
		setBoardData((prev) => {
			if (!prev) return null;

			return {
				...prev,
				boardUsers: [
					...prev.boardUsers.filter((col) => col.id !== colleague.id),
				],
			};
		});
	};

	return {
		addBoardColleague,
		removeBoardColleague,
		isEditBoardUsersModalOpen,
		toggleIsEditBoardUsersModalOpen,
	};
};
