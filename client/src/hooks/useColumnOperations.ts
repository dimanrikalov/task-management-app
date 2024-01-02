import {
	setSelectedTask,
	toggleIsModalOpen,
	clearTaskModalData,
	setSelectedColumnId,
} from '@/app/taskModalSlice';
import { useEffect, useState } from 'react';
import { useEditBoard } from './useEditBoard';
import { ITask } from '@/components/Task/Task';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useBoardContext } from '@/contexts/board.context';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { COLUMN_ENDPOINTS, METHODS, request } from '@/utils/requester';

const defaultColumnNames = ['to do', 'doing', 'done'];
const defaultNewColumnName = import.meta.env.VITE_DEFAULT_COLUMN_NAME as string;

interface IUseColumnOperationsArgs {
	id: number;
	title: string;
}

export const useColumnOperations = ({
	id,
	title,
}: IUseColumnOperationsArgs) => {
	const dispatch = useAppDispatch();
	const { updateColumnData } = useEditBoard();
	const { boardData, setBoardData } = useBoardContext();
	const [inputValue, setInputValue] = useState<string>('');
	const { accessToken } = useAppSelector((state) => state.user);
	const [showDeleteBtn, setShowDeleteBtn] = useState<boolean>(false);
	const [isInputModeOn, setIsInputModeOn] = useState(
		title === defaultNewColumnName
	);

	const isDefaultColumn = defaultColumnNames.includes(title.toLowerCase());

	useEffect(() => {
		if (!isInputModeOn || title === defaultNewColumnName) return;
		setInputValue(title);
	}, [isInputModeOn]);

	const toggleSetShowDeleteBtn = () => {
		setShowDeleteBtn((prev) => !prev);
	};

	const toggleIsInputModeOn = () => {
		if (isDefaultColumn) return;
		setIsInputModeOn((prev) => !prev);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleColumnNameChange = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		const inputVal = inputValue.trim();
		const nameBeforeChange = title;

		try {
			if (inputVal.length < 2 && title === defaultNewColumnName) {
				dispatch(
					setErrorMessageAsync(
						'Column name must be at least 2 characters!'
					)
				);
				return;
			}

			if (inputVal === '' || inputVal === title) {
				toggleIsInputModeOn();
				return;
			}
			if (inputVal === '' && title === defaultNewColumnName) {
				throw new Error('Column name is required!');
			}
			if (inputVal === title && title === defaultNewColumnName) {
				throw new Error('Please use another name!');
			}

			const res = await request({
				accessToken,
				method: METHODS.PUT,
				body: { newName: inputVal },
				endpoint: COLUMN_ENDPOINTS.RENAME(id),
			});

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			updateColumnData(id, inputVal);
		} catch (err: any) {
			if (title === defaultNewColumnName) {
				dispatch(setErrorMessageAsync(err.message));
				return;
			}
			updateColumnData(id, nameBeforeChange);
		}

		toggleIsInputModeOn();
	};

	const handleColumnDeletion = async () => {
		try {
			if (!boardData) {
				throw new Error('Board data is missing!');
			}

			/*
				deleting a column moves it to the last index then 
				deletes it so that the indexes of the columns remain intact
			*/
			const res = await request({
				accessToken,
				method: METHODS.DELETE,
				endpoint: COLUMN_ENDPOINTS.EDIT(id),
			});

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			//filter out the column inside the local state to reflect successful deletion
			setBoardData((prev) => {
				if (!prev) return null;

				return {
					...prev,
					columns: prev.columns.filter((col) => col.id !== id),
				};
			});
		} catch (err: any) {
			console.log(err.message);
			dispatch(setErrorMessageAsync(err.message));
		}
	};

	const taskClickHandler = (task: ITask) => {
		dispatch(setSelectedTask({ selectedTask: task }));
		dispatch(setSelectedColumnId({ selectedColumnId: -1 }));
		dispatch(toggleIsModalOpen());
	};

	const onClick = () => {
		dispatch(clearTaskModalData());
		dispatch(setSelectedColumnId({ selectedColumnId: id }));
		dispatch(toggleIsModalOpen());
	};

	return {
		onClick,
		inputValue,
		showDeleteBtn,
		isInputModeOn,
		taskClickHandler,
		handleInputChange,
		toggleIsInputModeOn,
		handleColumnDeletion,
		handleColumnNameChange,
		toggleSetShowDeleteBtn,
	};
};
