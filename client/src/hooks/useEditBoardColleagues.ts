import { useState } from 'react';
import { useErrorContext } from '../contexts/error.context';
import { useBoardContext } from '../contexts/board.context';
import { BOARD_ENDPOINTS, METHODS, request } from '../utils/requester';
import { IUser } from '../components/AddColleagueInput/AddColleagueInput';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';
import { EDIT_COLLEAGUE_METHOD } from '../views/WorkspaceView/Workspace.viewmodel';

export const useEditBoardColleagues = () => {
	const { showError } = useErrorContext();
	const { accessToken } = useUserContext() as IUserContextSecure;
	const { boardData, setBoardData } = useBoardContext();
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
			showError(err.message);
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
