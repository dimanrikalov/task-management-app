import React from 'react';
import { FaEdit } from 'react-icons/fa';
import styles from './column.module.css';
import { ITask, Task } from '../Task/Task';
import { MdDeleteOutline } from 'react-icons/md';
import { colors } from '../../hooks/useConfetti';
import { IntroInput } from '../IntroInput/IntroInput';
import ConfettiExplosion from 'react-confetti-explosion';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { IUser } from '../AddColleagueInput/AddColleagueInput';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';
import { useColumnOperations } from '../../hooks/useColumnOperations';

export interface IColumnProps {
	id: number;
	index: number;
	title: string;
	tasks: ITask[];
	users: IUser[];
	hasDragStarted: boolean;
	shouldConfettiExplode: boolean;
}

export const Column = React.memo(
	({
		id,
		index,
		users,
		title,
		tasks,
		hasDragStarted,
		shouldConfettiExplode
	}: IColumnProps) => {
		const {
			onClick,
			inputValue,
			showDeleteBtn,
			isInputModeOn,
			taskClickHandler,
			handleInputChange,
			toggleIsInputModeOn,
			handleColumnDeletion,
			toggleSetShowDeleteBtn,
			handleColumnNameChange
		} = useColumnOperations({ id, title });

		return (
			<>
				{title === 'Done' && shouldConfettiExplode && (
					<ConfettiExplosion
						force={0.3}
						duration={1500}
						colors={colors}
						className={styles.confetti}
					/>
				)}
				<Draggable
					index={index}
					draggableId={`column-${id}`} // Unique draggableId for columns
					isDragDisabled={hasDragStarted}
				>
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.draggableProps}
							className={styles.background}
						>
							{isInputModeOn ? (
								showDeleteBtn ? (
									<button
										{...provided.dragHandleProps}
										className={styles.confirmBtn}
										onClick={handleColumnDeletion}
										onMouseOut={toggleSetShowDeleteBtn}
									>
										Confirm
									</button>
								) : (
									<form
										{...provided.dragHandleProps}
										onSubmit={handleColumnNameChange}
										className={styles.changeNameContainer}
									>
										<IntroInput
											type="text"
											value={inputValue}
											name="column-name-input"
											onChange={handleInputChange}
											placeholder="Enter column name"
										/>
										<button
											className={styles.submitBtn}
											type="submit"
										>
											<FaEdit className={styles.icon} />
										</button>
										<button
											type="button"
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
							) : (
								<h2
									className={styles.title}
									{...provided.dragHandleProps}
									onDoubleClick={toggleIsInputModeOn}
								>
									{title}
								</h2>
							)}
							<Droppable
								type="task"
								droppableId={`column-${id}`} // Unique droppableId for columns
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
														hasDragStarted={
															hasDragStarted
														}
														onClick={() =>
															taskClickHandler(
																task
															)
														}
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
									onClick={onClick}
									message={'Add task'}
								/>
							</div>
						</div>
					)}
				</Draggable>
			</>
		);
	},
	// Use areEqual function to compare props and prevent re-rendering
	(prevProps, nextProps) => {
		return (
			prevProps.id === nextProps.id &&
			prevProps.index === nextProps.index &&
			prevProps.title === nextProps.title &&
			prevProps.tasks === nextProps.tasks &&
			prevProps.users === nextProps.users &&
			prevProps.hasDragStarted === nextProps.hasDragStarted &&
			prevProps.shouldConfettiExplode === nextProps.shouldConfettiExplode
		);
	}
);
