import classNames from 'classnames';
import { Modal } from '../Modal/Modal';
import { IoAdd } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { FaXmark } from 'react-icons/fa6';
import { FcAddImage } from 'react-icons/fc';
import styles from './taskOperationsModal.module.css';
import { IntroInput } from '../IntroInput/IntroInput';
import { useTranslate } from '../../hooks/useTranslate';
import { UsernameInput } from '../UsernameInput/UsernameInput';
import { useBoardContext } from '../../contexts/board.context';
import { ListContainer } from '../ListContainer/ListContainer';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';
import { useCreateTaskOperations } from '../../hooks/useCreateTaskOperations';

const basePath = 'taskModal';

const translationPaths = {
	low: `${basePath}.low`,
	high: `${basePath}.high`,
	hours: `${basePath}.hours`,
	medium: `${basePath}.medium`,
	effort: `${basePath}.effort`,
	minutes: `${basePath}.minutes`,
	addTask: `${basePath}.addTask`,
	editTask: `${basePath}.editTask`,
	addSteps: `${basePath}.addSteps`,
	letsEdit: `${basePath}.letsEdit`,
	priority: `${basePath}.priority`,
	editName: `${basePath}.editName`,
	inputName: `${basePath}.inputName`,
	stepInput: `${basePath}.stepInput`,
	editSteps: `${basePath}.editSteps`,
	timeSpent: `${basePath}.timeSpent`,
	enterName: `${basePath}.enterName`,
	letsCreate: `${basePath}.letsCreate`,
	deleteTask: `${basePath}.deleteTask`,
	editAssignee: `${basePath}.editAssignee`,
	timeEstimation: `${basePath}.timeEstimation`,
	chooseAssignee: `${basePath}.chooseAssignee`,
	addDescription: `${basePath}.addDescription`,
	confirmDeletion: `${basePath}.confirmDeletion`,
	editDescription: `${basePath}.editDescription`,
	descriptionEdit: `${basePath}.descriptionEdit`,
	enterDescription: `${basePath}.enterDescription`,
	overallCompletion: `${basePath}.overallCompletion`,
	descriptionCreate: `${basePath}.descriptionCreate`,
}

export const TaskOperationsModal = () => {
	const { t } = useTranslate();
	const { state, operations } = useCreateTaskOperations();
	const { selectedTask, selectedColumnName, toggleIsTaskModalOpen } = useBoardContext();

	return (
		<Modal>
			<div className={styles.backgroundWrapper}>
				<div className={styles.background}>
					<div className={styles.header}>
						<h1>
							{
								selectedTask ?
									t(translationPaths.letsEdit) :
									t(translationPaths.letsCreate)
							}
						</h1>
						<RxCross2
							className={styles.closeBtn}
							onClick={toggleIsTaskModalOpen}
						/>
					</div>

					<div className={styles.body}>
						<div className={styles.left}>
							<p>
								{
									selectedTask ?
										t(translationPaths.descriptionEdit)
										:
										t(translationPaths.descriptionCreate)
								}
							</p>
							<div className={styles.stepOne}>
								<h2>
									{
										selectedTask ?
											t(translationPaths.editName)
											:
											t(translationPaths.enterName)
									}
								</h2>
								<IntroInput
									name="title"
									type="text"
									value={state.inputValues.title}
									onChange={operations.handleInputChange}
									placeholder={t(translationPaths.inputName)}
								/>
							</div>

							<div className={styles.stepTwo}>
								<h2>
									{
										selectedTask
											? t(translationPaths.editDescription)
											: t(translationPaths.addDescription)
									}
								</h2>
								<textarea
									rows={10}
									name="description"
									className={styles.textArea}
									value={state.inputValues.description}
									onChange={operations.handleInputChange}
									placeholder={`${t(translationPaths.enterDescription)}...`}
								/>
							</div>
						</div>

						<div className={styles.middle}>
							<label
								htmlFor={'image'}
								className={styles.imgInput}
							>
								<div className={classNames(
									styles.imgContainer,
									state.taskImagePath &&
									styles.colorBorder)}
								>
									{
										state.taskImagePath ? (
											<img
												alt="task-img"
												src={state.taskImagePath}
												className={styles.previewImage}
											/>
										) : (
											<FcAddImage size={92} />
										)}
								</div>
							</label>

							<input
								id="image"
								type="file"
								name="image"
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
											!state.inputValues.image &&
											styles.disabled
										)}
									/>
								</button>
							</div>
							<div className={styles.priority}>
								<h3 className={styles.fieldTitle}>
									{t(translationPaths.priority)}:
								</h3>
								<select
									name="priority"
									className={styles.select}
									value={state.inputValues.priority}
									onChange={operations.handleInputChange}
								>
									<option value={'1'}>{t(translationPaths.low)}</option>
									<option value={'2'}>{t(translationPaths.medium)}</option>
									<option value={'3'}>{t(translationPaths.high)}</option>
								</select>
							</div>
							<div className={styles.effort}>
								<h3 className={styles.fieldTitle}>
									{t(translationPaths.effort)}:
								</h3>
								<select
									name="effort"
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
									{t(translationPaths.timeEstimation)}:
								</h3>
								<div className={styles.rightSide}>
									<div className={styles.inputDiv}>
										<input
											min={0}
											type="number"
											placeholder="1"
											name="estimatedHours"
											className={styles.numberInput}
											onChange={
												operations.handleInputChange
											}
											value={
												state.inputValues.estimatedHours
											}
										/>
										<p>{t(translationPaths.hours)}</p>
									</div>
									<div className={styles.inputDiv}>
										<input
											min={0}
											max={59}
											type="number"
											placeholder="45"
											name="estimatedMinutes"
											className={styles.numberInput}
											onChange={
												operations.handleInputChange
											}
											value={
												state.inputValues
													.estimatedMinutes
											}
										/>
										<p>{t(translationPaths.minutes)}</p>
									</div>
								</div>
							</div>
							<div className={styles.timeEstimation}>
								<h3 className={styles.fieldTitle}>
									{t(translationPaths.timeSpent)}
								</h3>
								<div className={styles.rightSide}>
									<div className={styles.inputDiv}>
										<input
											min={0}
											type="number"
											placeholder="1"
											name="hoursSpent"
											className={styles.numberInput}
											value={state.inputValues.hoursSpent}
											onChange={
												operations.handleInputChange
											}
										/>
										<p>{t(translationPaths.hours)}</p>
									</div>
									<div className={styles.inputDiv}>
										<input
											min={0}
											max={59}
											type="number"
											placeholder="45"
											name="minutesSpent"
											className={styles.numberInput}
											value={
												state.inputValues.minutesSpent
											}
											onChange={
												operations.handleInputChange
											}
										/>
										<p>{t(translationPaths.minutes)}</p>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.right}>
							<div className={styles.assigneeInput}>
								<h2>
									{
										selectedTask
											? t(translationPaths.editAssignee)
											: t(translationPaths.chooseAssignee)
									}
								</h2>
								<UsernameInput
									isLoading={false}
									taskModalMode={true}
									matches={state.matches}
									addUser={operations.selectAssignee}
									inputValue={state.inputValues.username}
									onChange={operations.handleInputChange}
								/>
							</div>
							<div className={styles.stepContainer}>
								<div className={styles.addSteps}>
									<h2>
										{
											selectedTask
												? t(translationPaths.editSteps)
												: t(translationPaths.addSteps)
										}
									</h2>
									<div className={styles.stepInputDiv}>
										<IntroInput
											type="text"
											name="step"
											placeholder={t(translationPaths.stepInput)}
											value={state.inputValues.step}
											onChange={
												operations.handleInputChange
											}
										/>

										<IoAdd
											className={classNames(
												styles.addStepBtn,
												!state.inputValues.step &&
												styles.disabled
											)}
											onClick={
												state.inputValues.step
													? operations.addStep
													: () => { }
											}
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
									lockStatus={selectedColumnName === 'Done'}
								/>
							</div>
							<h3 className={styles.progress}>
								{t(translationPaths.overallCompletion)}: {state.progress}%
							</h3>
							<IntroButton
								message={
									selectedTask
										? t(translationPaths.editTask)
										: t(translationPaths.addTask)
								}
								disabled={
									!!!state.inputValues.title ||
									!state.assigneeId
								}
								onClick={
									selectedTask
										? operations.editTask
										: operations.createTask
								}
							/>
							{selectedTask && (
								<>
									{state.showConfirmButton ? (
										<button
											onClick={operations.deleteTask}
											className={styles.deleteTaskBtn}
											onMouseOut={
												operations.toggleConfirmationBtn
											}
										>
											{t(translationPaths.confirmDeletion)}
										</button>
									) : (
										<button
											className={styles.deleteTaskBtn}
											onClick={
												operations.toggleConfirmationBtn
											}
										>
											{t(translationPaths.deleteTask)}
										</button>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};
