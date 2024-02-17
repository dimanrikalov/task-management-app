import {
	IInputState,
	useTaskModalContext
} from '../contexts/taskModal.context';
import { useState, useEffect } from 'react';
import { ITask } from '../components/Task/Task';
import { useTaskOperations } from './useTaskOperations';
import { useErrorContext } from '../contexts/error.context';
import { useBoardContext } from '../contexts/board.context';
import { generateFileFromBase64 } from '../utils/convertImages';
import { useTaskImageOperations } from './useTaskImageOperations';
import { ViewModelReturnType } from '../interfaces/viewModel.interface';
import { IUser } from '../components/AddColleagueInput/AddColleagueInput';
import { IEditStep, IStep, useStepsOperations } from './useStepsOperations';

interface ICreateTaskOperationsState {
	steps: IStep[];
	progress: number;
	matches: IUser[];
	inputValues: IInputState;
	assigneeId: number | null;
	selectedTask: ITask | null;
	showConfirmButton: boolean;
	taskImagePath: string | null;
}

interface ICreateTaskOperations {
	addStep(): void;
	clearTaskImage(): void;
	editTask(): Promise<void>;
	deleteTask(): Promise<void>;
	createTask(): Promise<void>;
	toggleConfirmationBtn(): void;
	loadTaskData(task: ITask): void;
	showError(message: string): void;
	selectAssignee(user: IUser): void;
	removeStep(description: string): void;
	toggleStatus(description: string): void;
	setMatches: React.Dispatch<React.SetStateAction<IUser[]>>;
	changeTaskImage(e: React.ChangeEvent<HTMLInputElement>): void;
	handleInputChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	): void;
}

export const useCreateTaskOperations = (): ViewModelReturnType<
	ICreateTaskOperationsState,
	ICreateTaskOperations
> => {
	const {
		matches,
		assigneeId,
		setMatches,
		inputValues,
		selectAssignee,
		setInputValues,
		handleInputChange
	} = useTaskModalContext();
	const { showError } = useErrorContext();
	const { workspaceUsers, selectedTask } = useBoardContext();
	const [showConfirmButton, setShowConfirmButton] = useState<boolean>(false);
	const { steps, setSteps, addStep, removeStep, progress, toggleStatus } =
		useStepsOperations();
	const { taskImagePath, clearTaskImage, changeTaskImage, setTaskImagePath } =
		useTaskImageOperations();
	const { editTask, createTask, deleteTask } = useTaskOperations({
		inputValues,
		steps
	});

	useEffect(() => {
		if (!selectedTask) return;
		loadTaskData(selectedTask);
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
				[key]: value
			}));
		});

		//remove the encoding string in front of the encoded img
		const base64 = task.attachmentImgPath?.slice(
			task.attachmentImgPath.indexOf(',') + 1
		);

		const image = base64
			? generateFileFromBase64(base64, 'image/png', 'task-img')
			: null;
		setInputValues((prev) => ({
			...prev,
			image,
			username:
				workspaceUsers.find((user) => user.id === task.assigneeId)
					?.username || ''
		}));

		// Set the sorted steps
		setSteps(sortedSteps);

		if (task.attachmentImgPath) {
			setTaskImagePath(task.attachmentImgPath);
		} else {
			setTaskImagePath(null);
			setInputValues((prev) => ({ ...prev, image: null }));
		}
	};

	return {
		state: {
			steps,
			matches,
			progress,
			assigneeId,
			inputValues,
			selectedTask,
			taskImagePath,
			showConfirmButton
		},
		operations: {
			addStep,
			editTask,
			showError,
			setMatches,
			removeStep,
			deleteTask,
			createTask,
			loadTaskData,
			toggleStatus,
			selectAssignee,
			clearTaskImage,
			changeTaskImage,
			handleInputChange,
			toggleConfirmationBtn
		}
	};
};
