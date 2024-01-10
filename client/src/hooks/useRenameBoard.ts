import { useState } from 'react';
import { useErrorContext } from '../contexts/error.context';
import { useBoardContext } from '../contexts/board.context';
import { BOARD_ENDPOINTS, METHODS, request } from '../utils/requester';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';

export const useRenameBoard = () => {
	const { showError } = useErrorContext();
	const { accessToken } = useUserContext() as IUserContextSecure;
	const { boardData, setBoardData } = useBoardContext();
	const [boardNameInput, setBoardNameInput] = useState<string>('');
	const [isInputModeOn, setIsInputModeOn] = useState<boolean>(false);
	const handleBoardNameInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setBoardNameInput(e.target.value);
	};

	const toggleIsInputModeOn = () => {
		if (!boardData) return;
		setIsInputModeOn((prev) => !prev);
		setBoardNameInput(boardData.name);
	};

	const handleBoardNameChange = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		if (!boardData) return;

		if (boardData.name === boardNameInput) {
			setIsInputModeOn(false);
			return;
		}

		try {
			const data = await request({
				accessToken,
				method: METHODS.PUT,
				endpoint: BOARD_ENDPOINTS.RENAME(boardData.id),
				body: {
					newName: boardNameInput.trim(),
				},
			});

			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}
			setBoardData((prev) => {
				if (!prev) return null;

				return {
					...prev,
					name: boardNameInput,
				};
			});
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
		setIsInputModeOn(false);
	};

	return {
		isInputModeOn,
		boardNameInput,
		toggleIsInputModeOn,
		handleBoardNameChange,
		handleBoardNameInputChange,
	};
};
