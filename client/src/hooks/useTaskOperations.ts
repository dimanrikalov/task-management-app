import { IStep } from './useStepsOperations';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { METHODS, TASK_ENDPOINTS, request } from '@/utils/requester';
import { setCallForRefresh, toggleIsModalOpen } from '@/app/taskModalSlice';
import { IInputState, useTaskModalContext } from '@/contexts/taskModal.context';

interface IUseTaskOperationArgs {
	steps: IStep[];
	inputValues: IInputState;
}

export const useTaskOperations = ({
	steps,
	inputValues,
}: IUseTaskOperationArgs) => {
	const dispatch = useAppDispatch();
	const { assigneeId } = useTaskModalContext();
	const { accessToken } = useAppSelector((state) => state.user);
	const { selectedTask: taskData, selectedColumnId } = useAppSelector(
		(state) => state.taskModal
	);

	const setErrorMessage = (message: string) => {
		dispatch(setErrorMessageAsync(message));
	};

	const toggleIsCreateTaskModalOpen = () => {
		dispatch(toggleIsModalOpen());
	};

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
			const body = {
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
				estimatedMinutes: Number(inputValues.estimatedMinutes) || 0,
			};

			const data = await request({
				body,
				accessToken,
				method: METHODS.POST,
				endpoint: TASK_ENDPOINTS.BASE,
			});

			//set task image optionally
			if (inputValues.image) {
				const payload = new FormData();
				payload.append('taskImg', inputValues.image, 'task-img');

				const imageUploadData = await request({
					accessToken,
					body: payload,
					method: METHODS.PUT,
					endpoint: TASK_ENDPOINTS.UPLOAD_IMG(data.taskId),
				});

				if (imageUploadData.errorMessage) {
					throw new Error(imageUploadData.errorMessage);
				}
			}
			toggleIsCreateTaskModalOpen();
			dispatch(setCallForRefresh({ callForRefresh: true }));
		} catch (err: any) {
			console.log(err.message);
			setErrorMessage(err.message);
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

			const body = {
				steps,
				assigneeId,
				title: inputValues.title,
				description: inputValues.description,
				effort: Number(inputValues.effort) || 1,
				priority: Number(inputValues.priority) || 1,
				hoursSpent: Number(inputValues.hoursSpent) || 0,
				minutesSpent: Number(inputValues.minutesSpent) || 0,
				estimatedHours: Number(inputValues.estimatedHours) || 0,
				estimatedMinutes: Number(inputValues.estimatedMinutes) || 0,
			};

			const res = await request({
				accessToken,
				method: METHODS.PUT,
				body: { payload: body },
				endpoint: TASK_ENDPOINTS.EDIT(taskData.id),
			});

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			//set task image optionally
			if (inputValues.image) {
				const payload = new FormData();
				payload.append('taskImg', inputValues.image, 'task-img');

				const imageUploadData = await request({
					accessToken,
					body: payload,
					method: METHODS.PUT,
					endpoint: TASK_ENDPOINTS.UPLOAD_IMG(taskData.id),
				});

				if (imageUploadData.errorMessage) {
					throw new Error(imageUploadData.errorMessage);
				}
			}
			toggleIsCreateTaskModalOpen();
			dispatch(setCallForRefresh({ callForRefresh: true }));
		} catch (err: any) {
			console.log(err.message);
			setErrorMessage(err.message);
		}
	};

	const deleteTask = async () => {
		if (!taskData) return;

		try {
			const res = await request({
				accessToken,
				method: METHODS.DELETE,
				endpoint: TASK_ENDPOINTS.EDIT(taskData.id),
			});

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			toggleIsCreateTaskModalOpen();
			dispatch(setCallForRefresh({ callForRefresh: true }));
		} catch (err: any) {
			console.log(err.message);
			setErrorMessage(err.message);
		}
	};

	return {
		editTask,
		createTask,
		deleteTask,
		setErrorMessage,
		toggleIsCreateTaskModalOpen,
	};
};
