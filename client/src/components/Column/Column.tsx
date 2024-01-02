import {
	setSelectedTask,
	toggleIsModalOpen,
	clearTaskModalData,
	setSelectedColumnId,
} from '@/app/taskModalSlice';
import { FaEdit } from 'react-icons/fa';
import styles from './column.module.css';
import { ITask, Task } from '../Task/Task';
import { useEffect, useState } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import { useEditBoard } from '@/hooks/useEditBoard';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useBoardContext } from '@/contexts/board.context';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { IUser } from '../AddColleagueInput/AddColleagueInput';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';
import { COLUMN_ENDPOINTS, METHODS, request } from '@/utils/requester';

const defaultColumnNames = ['to do', 'doing', 'done'];
const defaultNewColumnName = import.meta.env.VITE_DEFAULT_COLUMN_NAME as string;

interface IColumnProps {
	id: number;
	index: number;
	title: string;
	tasks: ITask[];
	users: IUser[];
}

export const Column = ({
	id,
	index,
	users,
	title,
	tasks,
}: IColumnProps) => {
	const dispatch = useAppDispatch();
	const { updateColumnData } = useEditBoard();
	const { boardData, setBoardData } = useBoardContext();
	const [inputValue, setInputValue] = useState<string>('');
	const { accessToken } = useAppSelector((state) => state.user);
	const [showDeleteBtn, setShowDeleteBtn] = useState<boolean>(false);
	const [isInputModeOn, setIsInputModeOn] = useState(title === defaultNewColumnName);

	const isDefaultColumn = defaultColumnNames.includes(title.toLowerCase());

	useEffect(() => {
		if (!isInputModeOn ||
			title === defaultNewColumnName
		) return;
		setInputValue(title);
	}, [isInputModeOn]);

	const toggleSetShowDeleteBtn = () => {
		setShowDeleteBtn(prev => !prev);
	}

	const toggleIsInputModeOn = () => {
		if (isDefaultColumn) return;
		setIsInputModeOn(prev => !prev);
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	}

	const handleColumnNameChange = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const inputVal = inputValue.trim();
		const nameBeforeChange = title;

		try {
			if (inputVal.length < 2 && title === defaultNewColumnName) {
				dispatch(setErrorMessageAsync('Column name must be at least 2 characters!'));
				return
			}

			if (inputVal === '' || inputVal === title) {
				toggleIsInputModeOn();
				return;
			};
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
			})

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
	}

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
					columns: prev.columns.filter(col => col.id !== id)
				}
			})
		} catch (err: any) {
			console.log(err.message);
			dispatch(setErrorMessageAsync(err.message));
		}
	}

	const taskClickHandler = (task: ITask) => {
		dispatch(setSelectedTask({ selectedTask: task }));
		dispatch(setSelectedColumnId({ selectedColumnId: -1 }));
		dispatch(toggleIsModalOpen());
	};

	const onClick = () => {
		dispatch(clearTaskModalData());
		dispatch(setSelectedColumnId({ selectedColumnId: id }));
		dispatch(toggleIsModalOpen());
	}

	return (
		<Draggable
			index={index}
			draggableId={`column-${id}`} // Unique draggableId for columns
		>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className={styles.background}
				>
					{
						isInputModeOn ?
							(
								showDeleteBtn ?
									<button
										{...provided.dragHandleProps}
										className={styles.confirmBtn}
										onClick={handleColumnDeletion}
										onMouseOut={toggleSetShowDeleteBtn}
									>
										Confirm
									</button>
									:
									<form
										{...provided.dragHandleProps}
										onSubmit={handleColumnNameChange}
										className={styles.changeNameContainer}
									>
										<IntroInput
											type='text'
											value={inputValue}
											name='column-name-input'
											onChange={handleInputChange}
											placeholder='Enter column name'
										/>
										<button className={styles.submitBtn} type='submit'>
											<FaEdit className={styles.icon} />
										</button>
										<button
											type='button'
											className={styles.deleteBtn}
											onClick={toggleSetShowDeleteBtn}
										>
											<MdDeleteOutline
												size={24}
												className={styles.icon}
											/>
										</button>
									</form>
							)
							:
							<h2 className={styles.title}
								{...provided.dragHandleProps}
								onDoubleClick={toggleIsInputModeOn}
							>
								{title}
							</h2>
					}
					<Droppable
						droppableId={`column-${id}`} // Unique droppableId for columns
						type="task"
					>
						{(provided) => (
							<>
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									className={styles.tasksContainer}
								>
									{tasks &&
										tasks.map((task, index) => (
											<Task
												task={task}
												index={index}
												key={task.id.toString()}
												onClick={() => taskClickHandler(task)}
												assigneeImgPath={users.find((user) =>
													user.id ===
													task.assigneeId
												)?.profileImagePath!
												}
											/>
										))}
									{provided.placeholder}
								</div>
							</>
						)}
					</Droppable>
					<div className={styles.addTask}>
						<IntroButton
							reverse={true}
							onClick={onClick}
							message={'Add task'}
						/>
					</div>
				</div>
			)}
		</Draggable>
	);
};
