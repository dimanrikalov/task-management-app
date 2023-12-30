import { useEffect } from 'react';
import classNames from 'classnames';
import { IoAdd } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { FaXmark } from 'react-icons/fa6';
import { ITask } from '@/components/Task/Task';
import styles from './createTaskView.module.css';
import { Modal } from '@/components/Modal/Modal';
import { useCreateTaskViewModel } from './CreateTask.viewmodel';
import { EmailInput } from '@/components/EmailInput/EmailInput';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { ListContainer } from '@/components/ListContainer/ListContainer';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';

interface ICreateTaskViewProps {
	columnId: number;
	boardUsers: IUser[],
	callForRefresh(): void;
	taskData?: ITask | null;
	toggleIsCreateTaskModalOpen(): void;
}

export const CreateTaskView = ({
	columnId,
	taskData,
	boardUsers,
	callForRefresh,
	toggleIsCreateTaskModalOpen,
}: ICreateTaskViewProps) => {
	const { state, operations } = useCreateTaskViewModel(boardUsers);

	const createTask = async () => {
		try {
			await operations.createTask(columnId);
			toggleIsCreateTaskModalOpen();
			callForRefresh();
		} catch (err: any) {
			console.log(err.message);
			operations.setErrorMessage(err.message);
		}
	}

	const editTask = async () => {
		if (!taskData) return;

		try {
			await operations.editTask(taskData.id);
			toggleIsCreateTaskModalOpen();
			callForRefresh();
		} catch (err: any) {
			console.log(err.message);
			operations.setErrorMessage(err.message);
		}
	}

	const deleteTask = async () => {
		if (!taskData) return;

		try {
			await operations.deleteTask(taskData.id);
			toggleIsCreateTaskModalOpen();
			callForRefresh();
		} catch (err: any) {
			console.log(err.message);
			operations.setErrorMessage(err.message);
		}
	}

	//set submit handler based on if there is taskData or not

	useEffect(() => {
		if (!taskData) return;
		operations.loadTaskData(taskData);
	}, []);

	return (
		<Modal>
			<div className={styles.backgroundWrapper}>
				<div className={styles.background}>
					<div className={styles.header}>
						<h1>Let's {taskData ? 'edit' : 'create'} a Task</h1>
						<RxCross2
							className={styles.closeBtn}
							onClick={toggleIsCreateTaskModalOpen}
						/>
					</div>

					<div className={styles.body}>
						<div className={styles.left}>
							{
								taskData ?
									<p>
										It is only normal that a <span className={styles.bold}>task</span>
										{' '} changes its properties throughout the lifecycle of a {' '}
										<span className={styles.bold}>board</span>. Fortunately with {' '}
										<span className={styles.bold}>Taskify</span>, no user should worry
										about modifying any task detail.
									</p>
									:
									<p>
										A <span className={styles.bold}>task</span> is the
										building block of a{' '}
										<span className={styles.bold}>board</span>. This is
										what an employee interacts with most of the time.
									</p>
							}

							<div className={styles.stepOne}>
								<h2>{taskData ? 'Edit task name' : 'Name your task'}</h2>
								<IntroInput
									name="title"
									type="text"
									placeholder="Enter task name"
									value={state.inputValues.title}
									onChange={operations.handleInputChange}
								/>
							</div>

							<div className={styles.stepTwo}>
								<h2>{taskData ? 'Edit description' : 'Add description'}</h2>
								<textarea
									rows={10}
									name="description"
									className={styles.textArea}
									placeholder="Enter task description"
									value={state.inputValues.description}
									onChange={operations.handleInputChange}
								/>
							</div>
						</div>

						<div className={styles.middle}>
							<label
								htmlFor={'image'}
								className={styles.imgInput}
							>
								<div className={styles.imgContainer}>
									{
										state.taskImagePath ?
											<img
												alt="task-img"
												src={state.taskImagePath}
												className={styles.previewImage}
											/>
											:
											<h3 className={styles.addTaskImgMessage}>
												Click here to add a task image
											</h3>
									}
								</div>
							</label>

							<input
								id='image'
								type='file'
								name='image'
								className={styles.fileInput}
								disabled={!!state.inputValues.image}
								onChange={operations.changeTaskImage}
								accept="image/png, image/jpg, image/gif, image/jpeg"
							/>
							<div className={styles.imgOperationsContainer}>

								<button
									className={styles.imgBtn}
									onClick={operations.clearTaskImage}
									disabled={!state.inputValues.image}
								>
									<FaXmark
										className={classNames(
											styles.resetBtn,
											styles.imgOperationBtn,
											!state.inputValues.image && styles.disabled
										)}
									/>
								</button>
							</div>
							<div className={styles.priority}>
								<h3 className={styles.fieldTitle}>Priority:</h3>
								<select
									name='priority'
									className={styles.select}
									onChange={operations.handleInputChange}
									value={state.inputValues.priority}
								>
									<option value={'1'}>Low</option>
									<option value={'2'}>Medium</option>
									<option value={'3'}>High</option>
								</select>
							</div>
							<div className={styles.effort}>
								<h3 className={styles.fieldTitle}>Effort:</h3>
								<select
									name='effort'
									className={styles.select}
									value={state.inputValues.effort}
									onChange={operations.handleInputChange}
								>
									<option value={'1'}>1</option>
									<option value={'2'}>2</option>
									<option value={'3'}>3</option>
									<option value={'4'}>4</option>
									<option value={'5'}>5</option>
								</select>
							</div>

							<div className={styles.timeEstimation}>
								<h3 className={styles.fieldTitle}>
									Time Estimation:
								</h3>
								<div className={styles.rightSide}>
									<div className={styles.inputDiv}>
										<input
											min={0}
											type="number"
											placeholder="1"
											name='estimatedHours'
											className={styles.numberInput}
											onChange={operations.handleInputChange}
											value={state.inputValues.estimatedHours}
										/>
										<p>h</p>
									</div>
									<div className={styles.inputDiv}>
										<input
											min={0}
											max={59}
											type="number"
											placeholder="45"
											name='estimatedMinutes'
											className={styles.numberInput}
											onChange={operations.handleInputChange}
											value={state.inputValues.estimatedMinutes}
										/>
										<p>m</p>
									</div>
								</div>
							</div>
							<div className={styles.timeEstimation}>
								<h3 className={styles.fieldTitle}>Time Spent:</h3>
								<div className={styles.rightSide}>
									<div className={styles.inputDiv}>
										<input
											min={0}
											type="number"
											placeholder="1"
											name='hoursSpent'
											className={styles.numberInput}
											value={state.inputValues.hoursSpent}
											onChange={operations.handleInputChange}
										/>
										<p>h</p>
									</div>
									<div className={styles.inputDiv}>
										<input
											min={0}
											max={59}
											type="number"
											placeholder="45"
											name='minutesSpent'
											className={styles.numberInput}
											value={state.inputValues.minutesSpent}
											onChange={operations.handleInputChange}
										/>
										<p>m</p>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.right}>
							<div className={styles.assigneeInput}>
								<h2>{taskData ? 'Edit assignee ' : 'Choose assignee'}</h2>
								<EmailInput
									isLoading={false}
									matches={state.matches}
									addUser={operations.selectAssignee}
									inputValue={state.inputValues.email}
									onChange={operations.handleInputChange}
								/>
							</div>
							<div className={styles.stepContainer}>
								<div className={styles.addSteps}>
									<h2>{taskData ? 'Edit steps' : 'Add steps'}</h2>
									<div className={styles.stepInputDiv}>
										<IntroInput
											type="text"
											name='step'
											placeholder='ex: "Take a nap"'
											value={state.inputValues.step}
											onChange={operations.handleInputChange}
										/>

										<IoAdd
											className={
												classNames(
													styles.addStepBtn,
													!state.inputValues.step && styles.disabled
												)
											}
											onClick={state.inputValues.step ? operations.addStep : () => { }}
										/>
									</div>
								</div>
								<ListContainer
									title=""
									mode="steps"
									noMarginBottom={true}
									disableDeletionFor={[]}
									colleagues={state.steps}
									removeUser={operations.removeStep}
									toggleStatus={operations.toggleStatus}
								/>
							</div>
							<h3 className={styles.progress}>
								Overall completion: {state.progress}%
							</h3>
							<IntroButton
								onClick={taskData ? editTask : createTask}
								message={taskData ? "Edit Task" : "Add Task"}
								disabled={!!!state.inputValues.title || !state.assigneeId}
							/>
							{
								taskData &&
								<>
									{state.showConfirmButton ?
										<button
											onClick={deleteTask}
											className={styles.deleteTaskBtn}
											onMouseOut={operations.toggleConfirmationBtn}
										>
											Confirm Deletion
										</button>
										:
										<button
											className={styles.deleteTaskBtn}
											onClick={operations.toggleConfirmationBtn}
										>
											Delete Task
										</button>
									}
								</>
							}
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};
