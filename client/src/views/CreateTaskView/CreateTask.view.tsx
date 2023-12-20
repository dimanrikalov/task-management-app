import classNames from 'classnames';
import { IoAdd } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { FaXmark } from 'react-icons/fa6';
import styles from './createTaskView.module.css';
import { useCreateTaskViewModel } from './CreateTask.viewmodel';
import { EmailInput } from '@/components/EmailInput/EmailInput';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { ListContainer } from '@/components/ListContainer/ListContainer';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';

interface ICreateTaskViewProps {
	columnId: number;
	boardUsers: IUser[],
	callForRefresh(): void;
	toggleIsCreateTaskModalOpen(): void;
}

export const CreateTaskView = ({
	columnId,
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
			operations.setErrorMessage(err.message);
			console.log(err.message);
		}
	}

	return (
		<div className={styles.backgroundWrapper}>
			<div className={styles.background}>
				<div className={styles.header}>
					<h1>Let's create a Task</h1>
					<RxCross2
						className={styles.closeBtn}
						onClick={toggleIsCreateTaskModalOpen}
					/>
				</div>

				<div className={styles.body}>
					<div className={styles.left}>
						<p>
							A <span className={styles.bold}>task</span> is the
							building block of a{' '}
							<span className={styles.bold}>board</span>. This is
							what an employee interacts with most of the time.
						</p>

						<div className={styles.stepOne}>
							<h2>Name your task</h2>

							<ErrorMessage
								fontSize={16}
								message={state.errorMessage || ''}
							/>

							<IntroInput
								name="name"
								type="text"
								placeholder="Enter task name"
								value={state.inputValues.name}
								onChange={operations.handleInputChange}
							/>
						</div>

						<div className={styles.stepTwo}>
							<h2>Add description</h2>
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
							className={styles.imgInput}
							htmlFor={'image'}
						>
							<div className={styles.imgContainer}>
								<img
									alt="task-img"
									className={styles.previewImage}
									src={state.taskImagePath || '/imgs/profile-img.jpeg'}
								/>
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
										name='spentHours'
										className={styles.numberInput}
										value={state.inputValues.spentHours}
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
										name='spentMinutes'
										className={styles.numberInput}
										value={state.inputValues.spentMinutes}
										onChange={operations.handleInputChange}
									/>
									<p>m</p>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.right}>
						<div className={styles.assigneeInput}>
							<h2>Choose assignee</h2>
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
								<h2>Add steps</h2>
								<div className={styles.stepInputDiv}>
									<IntroInput
										type="text"
										name='step'
										placeholder="Take a nap"
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
								mode="steps"
								title=""
								colleagues={state.steps}
								disableDeletionFor={[]}
								removeUser={operations.removeStep}
								toggleStatus={operations.toggleStatus}
							/>
						</div>
						<h3 className={styles.progress}>
							Overall completion: {state.progress}%
						</h3>
						<IntroButton
							message="Add Task"
							onClick={createTask}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
