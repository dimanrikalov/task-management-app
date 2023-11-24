import { IoAdd } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import styles from './createTaskView.module.css';
import { EmailInput } from '@/components/EmailInput/EmailInput';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { ListContainer } from '@/components/ListContainer/ListContainer';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';

interface ICreateTaskViewProps {
	toggleIsCreateTaskModalOpen(): void;
}

export const CreateTaskView = ({
	toggleIsCreateTaskModalOpen,
}: ICreateTaskViewProps) => {
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
								message="Task name is taken!"
								fontSize={16}
							/>
							<IntroInput
								name="name-input"
								onChange={() => {}}
								placeholder="Enter task name"
								type="text"
								value=""
							/>
						</div>

						<div className={styles.stepTwo}>
							<h2>Add description</h2>
							<textarea
								className={styles.textArea}
								name="description-input"
								rows={10}
								placeholder="Enter task description"
							/>
						</div>
					</div>

					<div className={styles.middle}>
						<div className={styles.taskImageContainer}>
							<img
								className={styles.taskImg}
								src="/imgs/intro-img-compressed.webp"
								alt="task-img"
							/>
						</div>
						<IntroButton message={'Upload Image'} />
						<div className={styles.priority}>
							<h3 className={styles.fieldTitle}>Priority:</h3>
							<select className={styles.select}>
								<option value="none">None</option>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
							</select>
						</div>
						<div className={styles.effort}>
							<h3 className={styles.fieldTitle}>Effort:</h3>
							<select className={styles.select}>
								<option value="none">None</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
							</select>
						</div>

						<div className={styles.timeEstimation}>
							<h3 className={styles.fieldTitle}>
								Time Estimation:
							</h3>
							<div className={styles.rightSide}>
								<div className={styles.inputDiv}>
									<input
										type="number"
										min={0}
										placeholder="1"
										className={styles.numberInput}
									/>
									<p>h</p>
								</div>
								<div className={styles.inputDiv}>
									<input
										type="number"
										max={59}
										min={0}
										placeholder="45"
										className={styles.numberInput}
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
										type="number"
										min={0}
										placeholder="1"
										className={styles.numberInput}
									/>
									<p>h</p>
								</div>
								<div className={styles.inputDiv}>
									<input
										type="number"
										max={59}
										min={0}
										placeholder="45"
										className={styles.numberInput}
									/>
									<p>m</p>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.right}>
						<div className={styles.stepContainer}>
							<div className={styles.addSteps}>
								<h2>Add steps</h2>
								<div className={styles.stepInputDiv}>
									<IntroInput
										value=""
										type="text"
										name="step-name"
										onChange={() => {}}
										placeholder="Take a nap"
									/>

									<IoAdd
										onClick={() => {}}
										className={styles.addStepBtn}
									/>
								</div>
							</div>
							<ListContainer title="Steps" mode="steps" />
						</div>
						<div className={styles.assigneeInput}>
							<h2>Choose assignee</h2>
							<EmailInput
								inputValue=""
								onChange={() => {}}
								results={[]}
							/>
							<h3 className={styles.progress}>
								Overall completion: 75%
							</h3>
							<IntroButton message="Add Task" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
