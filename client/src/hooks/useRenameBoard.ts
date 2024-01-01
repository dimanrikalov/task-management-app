import { useState } from 'react';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useBoardContext } from '@/contexts/board.context';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { BOARD_ENDPOINTS, METHODS, request } from '@/utils/requester';

export const useRenameBoard = () => {
	const dispatch = useAppDispatch();
	const { boardData, setBoardData } = useBoardContext();
	const { accessToken } = useAppSelector((state) => state.user);
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
			dispatch(setErrorMessageAsync(err.message));
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
