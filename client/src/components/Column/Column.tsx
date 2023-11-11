import styles from './column.module.css';
import { ITaskProps, Task } from '../Task/Task';

interface IColumnProps {
	title: string;
	tasks?: ITaskProps[];
}

export const Column = ({ title, tasks }: IColumnProps) => {
	return (
		<div className={styles.background}>
			<h2>{title}</h2>
			<div className={styles.tasksContainer}>
				{tasks &&
					tasks.map((task) => (
						<Task
							title={styles.task}
							priority={task.priority}
							stepsComplete={task.stepsComplete}
							totalSteps={task.totalSteps}
							asigneeImg={task.asigneeImg}
						/>
					))}
			</div>
		</div>
	);
};
