import { useEffect, useState } from 'react';
import { useEditBoard } from './useEditBoard';
import { ITask } from '../components/Task/Task';
import { useBoardContext } from '../contexts/board.context';
import { useErrorContext } from '../contexts/error.context';
import { COLUMN_ENDPOINTS, METHODS, request } from '../utils/requester';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';

const defaultColumnNames = ['to do', 'doing', 'done'];
const defaultNewColumnName = import.meta.env.VITE_DEFAULT_COLUMN_NAME as string;

interface IUseColumnOperationsArgs {
	id: number;
	title: string;
}

export const useColumnOperations = ({
	id,
	title
}: IUseColumnOperationsArgs) => {
	const {
		boardData,
		setBoardData,
		setSelectedTask,
		setSelectedColumnId,
		toggleIsTaskModalOpen
	} = useBoardContext();
	const { showError } = useErrorContext();
	const { updateColumnData } = useEditBoard();
	const [inputValue, setInputValue] = useState<string>('');
	const { accessToken } = useUserContext() as IUserContextSecure;

	const [showDeleteBtn, setShowDeleteBtn] = useState<boolean>(false);
	const [isInputModeOn, setIsInputModeOn] = useState(
		title === defaultNewColumnName
	);

	const isDefaultColumn = defaultColumnNames.includes(title.toLowerCase());

	//handle the case where some other user changes the column name
	useEffect(() => {
		setIsInputModeOn(title === defaultNewColumnName);
	}, [title]);

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
				showError('Column name must be at least 2 characters!');
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
				endpoint: COLUMN_ENDPOINTS.RENAME(id)
			});

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			updateColumnData(id, inputVal);
		} catch (err: any) {
			if (title === defaultNewColumnName) {
				showError(err.message);
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
				endpoint: COLUMN_ENDPOINTS.EDIT(id)
			});

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			//local state change
			setBoardData((prev) => {
				if (!prev) return null;

				const columnToDeleteIndex = prev.columns.findIndex(
					(col) => col.id === id
				);

				const updatedColumns = prev.columns.map((col, i) => {
					if (i > columnToDeleteIndex) {
						return {
							...col,
							position: col.position - 1
						};
					}

					return col;
				});
				updatedColumns.splice(columnToDeleteIndex, 1);

				return {
					...prev,
					columns: updatedColumns
				};
			});
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	};

	const taskClickHandler = (task: ITask) => {
		setSelectedTask(task);
		toggleIsTaskModalOpen();
		setSelectedColumnId(null);
	};

	const onClick = () => {
		setSelectedTask(null);
		setSelectedColumnId(id);
		toggleIsTaskModalOpen();
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
		toggleSetShowDeleteBtn
	};
};
