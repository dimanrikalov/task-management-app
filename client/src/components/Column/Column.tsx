import styles from './column.module.css';
import { ITaskProps, Task } from '../Task/Task';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';

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
							title={task.title}
							priority={task.priority}
							totalSteps={task.totalSteps}
							asigneeImg={task.asigneeImg}
							stepsComplete={task.stepsComplete}
							taskImg={
								i % 2 == 0 ? '/imgs/home-img.png' : undefined
							}
						/>
					))}

				<IntroButton
					onClick={onClick}
					message={'Add task'}
				/>

			</div>
		</div>
	);
};
