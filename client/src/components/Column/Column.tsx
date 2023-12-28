import { FaEdit } from 'react-icons/fa';
import styles from './column.module.css';
import { ITask, Task } from '../Task/Task';
import { MdDeleteOutline } from "react-icons/md";
import { useOutletContext } from 'react-router-dom';
import { IOutletContext } from '@/guards/authGuard';
import { useContext, useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';
import { IUser } from '../AddColleagueInput/AddColleagueInput';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';
import { ErrorContext, IErrorContext } from '@/contexts/ErrorContext';
import { COLUMN_ENDPOINTS, METHODS, request } from '@/utils/requester';

interface IColumnProps {
	id: number;
	index: number;
	title: string;
	tasks: ITask[];
	users: IUser[];
	callForRefresh(): void;
	onTaskClick(task: ITask): void;
	onClick(columnId: number): void;
	updateColumn(columnId: number, columnName: string): void;
}

export const Column = ({
	id,
	index,
	users,
	title,
	tasks,
	onClick,
	onTaskClick,
	updateColumn,
	callForRefresh,
}: IColumnProps) => {
	const [inputValue, setInputValue] = useState<string>('');
	const [isInputModeOn, setIsInputModeOn] = useState(false);
	const { accessToken } = useOutletContext<IOutletContext>();
	const [showDeleteBtn, setShowDeleteBtn] = useState<boolean>(false);
	const { setErrorMessage } = useContext<IErrorContext>(ErrorContext);

	useEffect(() => {
		if (!isInputModeOn) return;

		setInputValue(title);
	}, [isInputModeOn]);

	useEffect(() => {
		if (showDeleteBtn) return;
		setIsInputModeOn(false);
	}, [showDeleteBtn]);

	const toggleSetShowDeleteBtn = () => {
		setShowDeleteBtn(prev => !prev);
	}

	const toggleIsInputModeOn = () => {
		setIsInputModeOn(prev => !prev);
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	}

	const handleColumnNameChange = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (inputValue === title) {
			toggleIsInputModeOn();
			return;
		};

		const nameBeforeChange = title;
		try {
			const res = await request({
				accessToken,
				method: METHODS.PUT,
				endpoint: COLUMN_ENDPOINTS.RENAME(id),
				body: {
					newName: inputValue.trim()
				}
			})

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			updateColumn(id, inputValue);
		} catch (err: any) {
			setErrorMessage(err.message);
			updateColumn(id, nameBeforeChange);
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

			callForRefresh();
		} catch (err: any) {
			console.log(err.message);
			setErrorMessage(err.message);
		}
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
												onClick={() => onTaskClick(task)}
												assigneeImgPath={
													users.find(
														(user) =>
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
							message={'Add task'}
							onClick={() => onClick(id)}
						/>
					</div>
				</div>
			)}
		</Draggable>
	);
};
