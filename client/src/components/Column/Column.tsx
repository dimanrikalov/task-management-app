import styles from './column.module.css';
import { ITaskProps, Task } from '../Task/Task';
import { Button } from '../Button/Button';

interface IColumnProps {
	title: string;
	onClick(): void;
	tasks?: ITaskProps[];
}

export const Column = ({ title, onClick, tasks }: IColumnProps) => {
	return (
		<div className={styles.background}>
			<h2 className={styles.title}>{title}</h2>
			<div className={styles.tasksContainer}>
				{tasks &&
					tasks.map((task, i) => (
						<Task
							title={styles.task}
							priority={task.priority}
							stepsComplete={task.stepsComplete}
							totalSteps={task.totalSteps}
							asigneeImg={task.asigneeImg}
							taskImg={
								i % 2 == 0 ? '/imgs/home-img.png' : undefined
							}
						/>
					))}
				<div className={styles.boxShadow}>
					<Button
						message={'Add task'}
						invert={true}
						onClick={onClick}
					/>
				</div>
			</div>
		</div>
	);
};
