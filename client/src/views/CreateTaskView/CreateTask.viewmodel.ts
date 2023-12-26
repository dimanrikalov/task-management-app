import { ITask } from '@/components/Task/Task';
import { useOutletContext } from 'react-router-dom';
import { IOutletContext } from '@/guards/authGuard';
import { METHODS, TASK_ENDPOINTS, request } from '@/utils/requester';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

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
	errorMessage: string;
	inputValues: IInputState;
	assigneeId: number | null;
	taskImagePath: string | null;
}

interface ICreateTaskViewModelOperations {
	addStep(): void;
	clearTaskImage(): void;
	loadTaskData(task: ITask): void;
	selectAssignee(user: IUser): void;
	removeStep(description: string): void;
	editTask(taskId: number): Promise<void>;
	toggleStatus(description: string): void;
	createTask(columnId: number): Promise<void>;
	setErrorMessage: Dispatch<SetStateAction<string>>;
	changeTaskImage(e: React.ChangeEvent<HTMLInputElement>): void;
	handleInputChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	): void;
}

export const useCreateTaskViewModel = (
	boardUsers: IUser[]
): ViewModelReturnType<
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
	const [steps, setSteps] = useState<IStep[]>([]);
	const [progress, setProgress] = useState<number>(0);
	const { accessToken } = useOutletContext<IOutletContext>();
	const [matches, setMatches] = useState<IUser[]>(boardUsers);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [assigneeId, setAssigneeId] = useState<number | null>(null);
	const [taskImagePath, setTaskImagePath] = useState<string | null>(null);

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

	useEffect(() => {
		if (!assigneeId) return;
		const email = boardUsers.find((user) => user.id === assigneeId)?.email;
		if (!email) return;
		setInputValues((prev) => ({
			...prev,
			email,
		}));
	}, [assigneeId]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValues((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const loadTaskData = (task: ITask) => {
		if (!task) return;

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
		}));
		setSteps(
			(task.steps as IEditStep[]).sort(
				(task1, task2) => task1.id - task2.id
			)
		);
		setAssigneeId(task.assigneeId);

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
		setTaskImagePath('');
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

	const createTask = async (columnId: number) => {
		if (!columnId) {
			throw new Error('Invalid column!');
		}

		if (!assigneeId) {
			throw new Error('Assignee is required!');
		}

		if (!inputValues.title) {
			throw new Error('Task name is required!');
		}

		if (inputValues.title.length < 2) {
			throw new Error('Task name must be at least 2 characters long!');
		}

		//create the task
		const body = {
			steps,
			columnId,
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
	};

	const editTask = async (taskId: number) => {
		if (!taskId) {
			throw new Error('Invalid task!');
		}

		if (!assigneeId) {
			throw new Error('Assignee is required!');
		}

		if (!inputValues.title) {
			throw new Error('Task name is required!');
		}

		if (inputValues.title.length < 2) {
			throw new Error('Task name must be at least 2 characters long!');
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

		await request({
			body: { payload: body },
			accessToken,
			method: METHODS.PUT,
			endpoint: TASK_ENDPOINTS.EDIT(taskId),
		});

		//set task image optionally
		if (inputValues.image) {
			const payload = new FormData();
			payload.append('taskImg', inputValues.image, 'task-img');

			const imageUploadData = await request({
				accessToken,
				body: payload,
				method: METHODS.PUT,
				endpoint: TASK_ENDPOINTS.UPLOAD_IMG(taskId),
			});

			if (imageUploadData.errorMessage) {
				throw new Error(imageUploadData.errorMessage);
			}
		}
	};

	return {
		state: {
			steps,
			matches,
			progress,
			assigneeId,
			inputValues,
			errorMessage,
			taskImagePath,
		},
		operations: {
			addStep,
			editTask,
			removeStep,
			createTask,
			loadTaskData,
			toggleStatus,
			selectAssignee,
			clearTaskImage,
			setErrorMessage,
			changeTaskImage,
			handleInputChange,
		},
	};
};
