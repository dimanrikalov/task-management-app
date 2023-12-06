import { useDrop } from 'react-dnd'
import styles from './column.module.css';
import { ITask, Task } from '../Task/Task';
import { useOutletContext } from 'react-router-dom';
import { IOutletContext } from '@/guards/authGuard';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';
interface IColumnProps {
	id: number;
	title: string;
	tasks: ITask[];
	callForRefresh(): void;
	onClick(columnId: number): void;
}

export const Column = ({ id, title, onClick, tasks, callForRefresh }: IColumnProps) => {
	const { accessToken } = useOutletContext<IOutletContext>();

	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'task',
		drop: async (item: any) => await dropImgHandler(item, id),
		collect: (monitor) => ({
			isOver: !!monitor.isOver()
		})
	}), [id])

	const dropImgHandler = async (item: any, destinationColumnId: number) => {
		if (destinationColumnId === item.columnId) {
			return;
		}

		try {
			await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks/move`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					taskId: item.id,
					destinationColumnId //the column where it is being dropped in
				})
			})

			callForRefresh();
		} catch (err: any) {
			console.log(err.message);
		}
	}

	return (
		<div className={styles.background}>
			<h2 className={styles.title}>{title}</h2>
			<div
				ref={drop}
				className={styles.tasksContainer}
			>
				{tasks &&
					tasks.map((task) => (
						<Task
							task={task}
							key={task.id}
							columnId={id}
						/>
					))}


			</div>
			<div className={styles.addTask}>
				<IntroButton
					reverse={true}
					message={'Add task'}
					onClick={() => onClick(id)}
				/>
			</div>
		</div>
	);
};
