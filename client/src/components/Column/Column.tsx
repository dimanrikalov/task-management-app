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

const defaultColumnName = 'new_column';

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
	const { setBoardData } = useBoardContext();
	const { updateColumnData } = useEditBoard();
	const [inputValue, setInputValue] = useState<string>('');
	const { accessToken } = useAppSelector((state) => state.user);
	const [showDeleteBtn, setShowDeleteBtn] = useState<boolean>(false);
	const [isInputModeOn, setIsInputModeOn] = useState(title === defaultColumnName);

	useEffect(() => {
		if (!isInputModeOn ||
			title === defaultColumnName
		) return;
		setInputValue(title);
	}, [isInputModeOn]);

	const toggleSetShowDeleteBtn = () => {
		setShowDeleteBtn(prev => !prev);
	}

	const toggleIsInputModeOn = () => {
		setIsInputModeOn(prev => !prev);
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value.trim());
	}

	const handleColumnNameChange = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (inputValue === '' && title === defaultColumnName) {
			dispatch(setErrorMessageAsync('Column name is required!'));
			return;
		}
		if (inputValue === title && title === defaultColumnName) {
			dispatch(setErrorMessageAsync('Please use another name!'));
			return;
		}
		if (inputValue === '' || inputValue === title) {
			toggleIsInputModeOn();
			return;
		};

		const nameBeforeChange = title;

		try {
			const res = await request({
				accessToken,
				method: METHODS.PUT,
				body: { newName: inputValue.trim() },
				endpoint: COLUMN_ENDPOINTS.RENAME(id),
			})

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			console.log('here');

			updateColumnData(id, inputValue);
		} catch (err: any) {
			updateColumnData(id, nameBeforeChange);
			dispatch(setErrorMessageAsync(err.message));
		}

		toggleIsInputModeOn();
	}

	const handleColumnDeletion = async () => {
		try {
			const res = await request({
				accessToken,
				method: METHODS.DELETE,
				endpoint: COLUMN_ENDPOINTS.EDIT(id),
			});

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

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
										Delete column
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
