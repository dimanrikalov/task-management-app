import { useBoardContext } from './board.context';
import { generateFileFromBase64 } from '../utils/convertImages';
import { createContext, useContext, useEffect, useState } from 'react';
import { IUser } from '../components/AddColleagueInput/AddColleagueInput';

export interface IInputState {
	title: string;
	step: string;
	effort: string;
	username: string;
	priority: string;
	image: File | null;
	hoursSpent: string;
	description: string;
	minutesSpent: string;
	estimatedHours: string;
	estimatedMinutes: string;
}

interface ITaskModalContext {
	matches: IUser[];
	inputValues: IInputState;
	assigneeId: number | null;
	setMatches: React.Dispatch<React.SetStateAction<IUser[]>>;
	handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
	setInputValues: React.Dispatch<React.SetStateAction<IInputState>>;
	setAssigneeId: React.Dispatch<React.SetStateAction<number | null>>;
}

const TaskModalContext = createContext<any>(null);

export const useTaskModalContext = () =>
	useContext<ITaskModalContext>(TaskModalContext);

export const TaskModalContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { boardData } = useBoardContext();
	const { selectedTask } = useBoardContext();
	const boardUsers = boardData?.boardUsers || [];
	const [matches, setMatches] = useState<IUser[]>([]);
	const [assigneeId, setAssigneeId] = useState<number | null>(null);
	const [inputValues, setInputValues] = useState<IInputState>({
		step: '',
		title: '',
		effort: '',
		image: null,
		username: '',
		priority: '',
		hoursSpent: '',
		description: '',
		minutesSpent: '',
		estimatedHours: '',
		estimatedMinutes: ''
	});

	useEffect(() => {
		if (!selectedTask) return;
		const username =
			boardUsers.find((user) => user.id === selectedTask.assigneeId)
				?.username || '';
		const image = selectedTask.attachmentImgPath
			? generateFileFromBase64(
				selectedTask.attachmentImgPath,
				'image/png',
				'task-img'
			)
			: null;
		setInputValues({
			image,
			username,
			step: '',
			title: selectedTask.title,
			description: selectedTask.description,
			effort: selectedTask.effort.toString(),
			priority: selectedTask.priority.toString(),
			hoursSpent: selectedTask.hoursSpent.toString(),
			minutesSpent: selectedTask.minutesSpent.toString(),
			estimatedHours: selectedTask.estimatedHours.toString(),
			estimatedMinutes: selectedTask.estimatedMinutes.toString()
		});
	}, [selectedTask]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValues((prev) => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	const data: ITaskModalContext = {
		matches,
		assigneeId,
		setMatches,
		inputValues,
		setAssigneeId,
		setInputValues,
		handleInputChange
	};
	return (
		<TaskModalContext.Provider value={data}>
			{children}
		</TaskModalContext.Provider>
	);
};
