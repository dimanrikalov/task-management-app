import {
	IInputState,
	useTaskModalContext
} from '../contexts/taskModal.context';
import { generateImgUrl } from '@/utils';
import { IStep } from './useStepsOperations';
import { useBoardContext } from '../contexts/board.context';
import { useErrorContext } from '../contexts/error.context';
import { convertImageToBase64 } from '../utils/convertImages';
import { METHODS, TASK_ENDPOINTS, request } from '../utils/requester';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';

interface IUseTaskOperationArgs {
	steps: IStep[];
	inputValues: IInputState;
}

export const useTaskOperations = ({
	steps,
	inputValues
}: IUseTaskOperationArgs) => {
	const {
		setBoardData,
		selectedColumnId,
		toggleIsTaskModalOpen,
		selectedTask: taskData
	} = useBoardContext();
	const { showError } = useErrorContext();
	const { assigneeId } = useTaskModalContext();
	const { accessToken } = useUserContext() as IUserContextSecure;

	const createTask = async () => {
		try {
			if (!selectedColumnId) {
				throw new Error('Invalid column!');
			}

			if (!assigneeId) {
				throw new Error('Assignee is required!');
			}

			if (!inputValues.title) {
				throw new Error('Task name is required!');
			}

			if (inputValues.title.length < 2) {
				throw new Error(
					'Task name must be at least 2 characters long!'
				);
			}

			//create the task
			const payload: any = {
				steps,
				assigneeId,
				title: inputValues.title,
				columnId: selectedColumnId,
				description: inputValues.description,
				effort: Number(inputValues.effort) || 1,
				priority: Number(inputValues.priority) || 1,
				hoursSpent: Number(inputValues.hoursSpent) || 0,
				minutesSpent: Number(inputValues.minutesSpent) || 0,
				estimatedHours: Number(inputValues.estimatedHours) || 0,
				estimatedMinutes: Number(inputValues.estimatedMinutes) || 0
			};

			let base64: string;
			//optionally add image
			if (inputValues.image) {
				base64 = await convertImageToBase64(inputValues.image);
				payload.attachmentImg = base64;
			}

			const data = await request({
				accessToken,
				body: payload,
				method: METHODS.POST,
				endpoint: TASK_ENDPOINTS.BASE
			});

			//check for handled errors
			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			setBoardData((prev) => {
				if (!prev) return null;
				const columnToUpdate = {
					...prev.columns.find((col) => col.id === selectedColumnId)!
				};

				const columns = [...prev.columns];
				columnToUpdate.tasks.push({
					...data.task,
					...(base64 && { attachmentImgPath: generateImgUrl(base64) })
				});

				columns.splice(columnToUpdate.position, 1, columnToUpdate);

				return {
					...prev,
					columns
				};
			});
			toggleIsTaskModalOpen();
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	};

	const editTask = async () => {
		if (!taskData) return;

		try {
			if (!taskData.id) {
				throw new Error('Invalid task!');
			}

			if (!assigneeId) {
				throw new Error('Assignee is required!');
			}

			if (!inputValues.title) {
				throw new Error('Task name is required!');
			}

			if (inputValues.title.length < 2) {
				throw new Error(
					'Task name must be at least 2 characters long!'
				);
			}

			const payload: any = {
				steps,
				assigneeId,
				title: inputValues.title,
				description: inputValues.description,
				effort: Number(inputValues.effort) || 1,
				priority: Number(inputValues.priority) || 1,
				hoursSpent: Number(inputValues.hoursSpent) || 0,
				minutesSpent: Number(inputValues.minutesSpent) || 0,
				estimatedHours: Number(inputValues.estimatedHours) || 0,
				estimatedMinutes: Number(inputValues.estimatedMinutes) || 0
			};

			let base64: string | null = null;
			//optionally add image
			if (inputValues.image) {
				base64 = await convertImageToBase64(inputValues.image);
				payload.attachmentImg = base64;
			}

			const data = await request({
				accessToken,
				method: METHODS.PUT,
				body: { payload },
				endpoint: TASK_ENDPOINTS.EDIT(taskData.id)
			});

			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}

			setBoardData((prev) => {
				if (!prev) return null;

				const columns = prev.columns.map((col) => {
					if (col.tasks.some((task) => task.id === taskData.id)) {
						const updatedTasks = col.tasks.map((task) =>
							task.id === taskData.id
								? {
										...data.task,
										...(base64 && {
											attachmentImgPath:
												generateImgUrl(base64)
										})
									}
								: task
						);
						return { ...col, tasks: updatedTasks };
					}
					return col;
				});

				return { ...prev, columns };
			});

			toggleIsTaskModalOpen();
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	};

	const deleteTask = async () => {
		if (!taskData) return;

		try {
			const res = await request({
				accessToken,
				method: METHODS.DELETE,
				endpoint: TASK_ENDPOINTS.EDIT(taskData.id)
			});

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			setBoardData((prev) => {
				if (!prev) return null;

				const columns = prev.columns.map((col) => {
					if (col.tasks.some((task) => task.id === taskData.id)) {
						const updatedTasks = col.tasks.filter(
							(task) => task.id !== taskData.id
						);
						return { ...col, tasks: updatedTasks };
					}
					return col;
				});

				return {
					...prev,
					columns
				};
			});

			toggleIsTaskModalOpen();
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	};

	return {
		editTask,
		createTask,
		deleteTask,
		toggleIsTaskModalOpen
	};
};
