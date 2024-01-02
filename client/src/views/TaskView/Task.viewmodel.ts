import {
	IStep,
	IEditStep,
	useStepsOperations,
} from '@/hooks/useStepsOperations';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { ITask } from '@/components/Task/Task';
import { useTaskOperations } from '@/hooks/useTaskOperations';
import { generateFileFromBase64 } from '@/utils/convertImages';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { useTaskImageOperations } from '@/hooks/useTaskImageOperations';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { useTaskAssigneeOperations } from '@/hooks/useTaskAssigneeOperations';
import { IInputState, useTaskModalContext } from '@/contexts/taskModal.context';

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
	editTask(): Promise<void>;
	deleteTask(): Promise<void>;
	createTask(): Promise<void>;
	toggleConfirmationBtn(): void;
	loadTaskData(task: ITask): void;
	selectAssignee(user: IUser): void;
	toggleIsCreateTaskModalOpen(): void;
	removeStep(description: string): void;
	setErrorMessage(message: string): void;
	toggleStatus(description: string): void;
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
	const {
		matches,
		assigneeId,
		inputValues,
		setInputValues,
		handleInputChange,
	} = useTaskModalContext();
	const { steps, setSteps, addStep, removeStep, progress, toggleStatus } =
		useStepsOperations();
	const {
		editTask,
		createTask,
		deleteTask,
		setErrorMessage,
		toggleIsCreateTaskModalOpen,
	} = useTaskOperations({ inputValues, steps });
	const { selectAssignee } = useTaskAssigneeOperations();
	const [showConfirmButton, setShowConfirmButton] = useState<boolean>(false);
	const { boardUsers, selectedTask: taskData } = useAppSelector(
		(state) => state.taskModal
	);
	const { taskImagePath, clearTaskImage, changeTaskImage, setTaskImagePath } =
		useTaskImageOperations();

	useEffect(() => {
		if (!taskData) return;
		loadTaskData(taskData);
	}, []);

	const toggleConfirmationBtn = () => {
		setShowConfirmButton((prev) => !prev);
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
			email:
				boardUsers.find((user) => user.id === task.assigneeId)?.email ||
				'',
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
