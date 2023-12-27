import { FaEdit } from "react-icons/fa";
import styles from './column.module.css';
import { ITask, Task } from '../Task/Task';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { IOutletContext } from '@/guards/authGuard';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { IntroInput } from '../Inputs/IntroInput/IntroInput';
import { IUser } from '../AddColleagueInput/AddColleagueInput';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';
import { COLUMN_ENDPOINTS, METHODS, request } from '@/utils/requester';

interface IColumnProps {
	id: number;
	index: number;
	title: string;
	tasks: ITask[];
	users: IUser[];
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
}: IColumnProps) => {
	const [inputValue, setInputValue] = useState<string>('');
	const [isInputModeOn, setIsInputModeOn] = useState(false);
	const { accessToken } = useOutletContext<IOutletContext>();
	useEffect(() => {
		if (!isInputModeOn) return;

		setInputValue(title);
	}, [isInputModeOn]);

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
					newName: inputValue
				}
			})

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			updateColumn(id, inputValue);
		} catch (err: any) {
			updateColumn(id, nameBeforeChange);
			console.log(err.message);
		}

		toggleIsInputModeOn();
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
								<button className={styles.submitBtn}>
									<FaEdit className={styles.icon} />
								</button>
							</form>
							:
							<h2 className={styles.title} {...provided.dragHandleProps} onDoubleClick={toggleIsInputModeOn}>
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
