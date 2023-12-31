import { useState, useEffect } from 'react';
import { ITask } from '@/components/Task/Task';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { METHODS, TASK_ENDPOINTS, request } from '@/utils/requester';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { setCallForRefresh, toggleIsModalOpen } from '@/app/taskModalSlice';

export interface IStep {
	isComplete: boolean;
	description: string;
}

interface IEditStep extends IStep {
	id: number;
}

interface IInputState {
	title: string;
	step: string;
	email: string;
	effort: string;
	priority: string;
	image: File | null;
	hoursSpent: string;
	description: string;
	minutesSpent: string;
	estimatedHours: string;
	estimatedMinutes: string;
}

interface ICreateTaskViewModelState {
	steps: IStep[];
	matches: IUser[];
	progress: number;
	taskData: ITask | null;
	inputValues: IInputState;
	assigneeId: number | null;
	showConfirmButton: boolean;
	taskImagePath: string | null;
}

interface ICreateTaskViewModelOperations {
	addStep(): void;
	clearTaskImage(): void;
	toggleConfirmationBtn(): void;
	loadTaskData(task: ITask): void;
	selectAssignee(user: IUser): void;
	toggleIsCreateTaskModalOpen(): void;
	removeStep(description: string): void;
	setErrorMessage(message: string): void;
	editTask(): Promise<void>;
	toggleStatus(description: string): void;
	deleteTask(): Promise<void>;
	createTask(): Promise<void>;
	changeTaskImage(e: React.ChangeEvent<HTMLInputElement>): void;
	handleInputChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	): void;
}

export const useCreateTaskViewModel = (): ViewModelReturnType<
	ICreateTaskViewModelState,
	ICreateTaskViewModelOperations
> => {
	const [inputValues, setInputValues] = useState<IInputState>({
		step: '',
		title: '',
		email: '',
		effort: '',
		image: null,
		priority: '',
		hoursSpent: '',
		description: '',
		minutesSpent: '',
		estimatedHours: '',
		estimatedMinutes: '',
	});
	const dispatch = useAppDispatch();
	const [steps, setSteps] = useState<IStep[]>([]);
	const [progress, setProgress] = useState<number>(0);
	const {
		boardUsers,
		selectedColumnId,
		selectedTask: taskData,
	} = useAppSelector((state) => state.taskModal);
	const [matches, setMatches] = useState<IUser[]>(boardUsers);
	const { accessToken } = useAppSelector((state) => state.user);
	const [assigneeId, setAssigneeId] = useState<number | null>(null);
	const [taskImagePath, setTaskImagePath] = useState<string | null>(null);
	const [showConfirmButton, setShowConfirmButton] = useState<boolean>(false);

	useEffect(() => {
		if (!taskData) return;
		loadTaskData(taskData);
	}, []);

	useEffect(() => {
		const assignee = matches.find(
			(user) =>
				user.email.trim().toLowerCase() ===
				inputValues.email.trim().toLowerCase()
		);

		if (assignee) {
			setAssigneeId(assignee.id);
			setMatches([]);
			return;
		}

		setAssigneeId(null);
		setMatches(
			boardUsers.filter((user) =>
				user.email
					.trim()
					.toLowerCase()
					.includes(inputValues.email.trim().toLowerCase())
			)
		);
	}, [inputValues.email]);

	useEffect(() => {
		if (!inputValues.image) {
			setTaskImagePath(null);
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setTaskImagePath(reader.result as string);
		};

		reader.readAsDataURL(inputValues.image);
	}, [inputValues]);

	useEffect(() => {
		const completedCount = steps.reduce(
			(acc, x) => acc + Number(x.isComplete),
			0
		);
		setProgress(Math.round((completedCount / steps.length) * 100) || 0);
	}, [steps]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValues((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const loadTaskData = (task: ITask) => {
		if (!task) return;

		// Sort task.steps by id
		const sortedSteps = task.steps
			? [...(task.steps as IEditStep[])].sort((a, b) => a.id - b.id)
			: [];

		Object.entries(task).forEach(([key, value]) => {
			setInputValues((prev) => ({
				...prev,
				[key]: value,
			}));
		});

		const image = generateFileFromBase64(
			task.attachmentImgPath,
			'image/png',
			'task-img'
		);

		setInputValues((prev) => ({
			...prev,
			image,
			email: boardUsers.find((user) => user.id === task.assigneeId)
				?.email!,
		}));

		// Set the sorted steps
		setSteps(sortedSteps);

		if (task.attachmentImgPath) {
			setTaskImagePath(`data:image/png;base64,${task.attachmentImgPath}`);
		} else {
			setTaskImagePath(null);
			setInputValues((prev) => ({ ...prev, image: null }));
		}
	};

	function generateFileFromBase64(
		base64String: string,
		contentType: string,
		fileName: string
	) {
		const blob = base64ToBlob(base64String, contentType);
		return new File([blob], fileName, { type: contentType });
	}

	function base64ToBlob(base64String: string, contentType: string) {
		const byteCharacters = atob(base64String);
		const byteNumbers = new Array(byteCharacters.length);

		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		return new Blob([byteArray], { type: contentType });
	}

	const changeTaskImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !e.target.files[0]) {
			return;
		}
		const selectedFile = e.target.files[0];

		setInputValues((prev) => ({
			...prev,
			image: selectedFile,
		}));

		e.target.value = '';
	};

	const selectAssignee = (user: IUser) => {
		setAssigneeId(user.id);
		setInputValues((prev) => ({ ...prev, email: user.email }));
	};

	const clearTaskImage = () => {
		setInputValues((prev) => ({ ...prev, image: null }));
		setTaskImagePath(null);
	};

	const addStep = () => {
		if (!inputValues.step) return;
		if (steps.some((step) => step.description === inputValues.step)) return;
		setSteps((prev) => [
			...prev,
			{ description: inputValues.step, isComplete: false },
		]);
		setInputValues((prev) => ({ ...prev, step: '' }));
	};

	const removeStep = (description: string) => {
		setSteps((prev) => [
			...prev.filter((step) => step.description !== description),
		]);
	};

	const toggleStatus = (description: string) => {
		const step = steps.find((step) => step.description === description);
		if (!step) return;
		setSteps((prev) =>
			prev.map((step) => {
				if (step.description === description) {
					return { ...step, isComplete: !step.isComplete };
				}
				return step;
			})
		);
	};

	const toggleConfirmationBtn = () => {
		setShowConfirmButton((prev) => !prev);
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

	const setErrorMessage = (message: string) => {
		dispatch(setErrorMessageAsync(message));
	};

	return {
		state: {
			steps,
			matches,
			taskData,
			progress,
			assigneeId,
			inputValues,
			taskImagePath,
			showConfirmButton,
		},
		operations: {
			addStep,
			editTask,
			removeStep,
			deleteTask,
			createTask,
			loadTaskData,
			toggleStatus,
			selectAssignee,
			clearTaskImage,
			setErrorMessage,
			changeTaskImage,
			handleInputChange,
			toggleConfirmationBtn,
			toggleIsCreateTaskModalOpen,
		},
	};
};
