import { useState, useEffect } from 'react';
import { IOutletContext } from '@/guards/authGuard';
import { useOutletContext } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

export interface IStep {
	isComplete: boolean;
	description: string;
}

interface IInputState {
	name: string;
	step: string;
	email: string;
	effort: number;
	priority: number;
	image: File | null;
	spentHours: number;
	description: string;
	spentMinutes: number;
	estimatedHours: number;
	estimatedMinutes: number;
}

interface ICreateTaskViewModelState {
	steps: IStep[];
	matches: IUser[];
	progress: number;
	errorMessage: string;
	taskImagePath: string;
	inputValues: IInputState;
}

interface ICreateTaskViewModelOperations {
	addStep(): void;
	clearTaskImage(): void;
	selectAssignee(user: IUser): void;
	createTask(columnId: number): void;
	removeStep(description: string): void;
	toggleStatus(description: string): void;
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
		name: '',
		email: '',
		effort: 1,
		image: null,
		priority: 1,
		spentHours: 0,
		description: '',
		spentMinutes: 0,
		estimatedHours: 0,
		estimatedMinutes: 0,
	});
	const [steps, setSteps] = useState<IStep[]>([]);
	const [progress, setProgress] = useState<number>(0);
	const { accessToken } = useOutletContext<IOutletContext>();
	const [matches, setMatches] = useState<IUser[]>(boardUsers);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [taskImagePath, setTaskImagePath] = useState<string>('');
	const [assigneeId, setAssigneeId] = useState<number | null>(null);

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
		setMatches(boardUsers);
	}, [inputValues.email]);

	useEffect(() => {
		if (!inputValues.image) {
			setTaskImagePath('');
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

	const changeTaskImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !e.target.files[0]) {
			return;
		}

		setInputValues((prev) => ({
			...prev,
			image: e.target.files![0],
		}));

		e.target.value = '';
	};

	const selectAssignee = (user: IUser) => {
		setAssigneeId(user.id);
		setInputValues((prev) => ({ ...prev, email: user.email }));
		console.log('here');
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
		try {
			if (!columnId) {
				throw new Error('Invalid column!');
			}

			if (!assigneeId) {
				throw new Error('Assignee is required!');
			}

			if (!inputValues.name) {
				throw new Error('Task name is required!');
			}

			if (inputValues.name.length < 2) {
				throw new Error(
					'Task name must be at least 2 characters long!'
				);
			}

			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/tasks`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify({
						steps,
						columnId,
						assigneeId,
						title: inputValues.name,
						effort: inputValues.effort,
						priority: inputValues.priority,
						attachmentImgPath: taskImagePath,
						hoursSpent: inputValues.spentHours,
						minutesSpent: inputValues.spentMinutes,
						estimatedHours: inputValues.estimatedHours,
						estimatedMinutes: inputValues.estimatedMinutes,
					}),
				}
			);

			const data = await res.json();
			console.log(data);
		} catch (err: any) {
			setErrorMessage(err.message);
			console.log(err.message);
		}
	};

	return {
		state: {
			steps,
			matches,
			progress,
			inputValues,
			errorMessage,
			taskImagePath,
		},
		operations: {
			addStep,
			removeStep,
			createTask,
			toggleStatus,
			selectAssignee,
			clearTaskImage,
			changeTaskImage,
			handleInputChange,
		},
	};
};
