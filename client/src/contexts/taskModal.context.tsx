import { generateImgUrl } from '@/utils';
import { useUserContext } from './user.context';
import { useBoardContext } from './board.context';
import { generateFileFromBase64 } from '../utils/convertImages';
import { BOARD_ENDPOINTS, METHODS, request } from '@/utils/requester';
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
	selectAssignee(user: IUser): void;
	setMatches: React.Dispatch<React.SetStateAction<IUser[]>>;
	handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
	setInputValues: React.Dispatch<React.SetStateAction<IInputState>>;
}

const TaskModalContext = createContext<any>(null);

export const useTaskModalContext = () =>
	useContext<ITaskModalContext>(TaskModalContext);

export const TaskModalContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const initalState = {
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
	}
	const { boardData } = useBoardContext();
	const { selectedTask } = useBoardContext();
	const [matches, setMatches] = useState<IUser[]>([])
	const { accessToken, data: userData } = useUserContext();
	const [boardUsers, setBoardUsers] = useState<IUser[]>([]);
	const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
	const [assigneeId, setAssigneeId] = useState<number | null>(null);
	const [inputValues, setInputValues] = useState<IInputState>(initalState);

	useEffect(() => {
		if (!selectedTask) return;
		const username =
			boardUsers.find((user) =>
				user.id === selectedTask.assigneeId
			)?.username || '';
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
	}, [selectedTask, boardUsers]);

	useEffect(() => {
		if (assigneeId) {
			setMatches([]);
			return;
		}
		setMatches(boardUsers);
	}, [assigneeId]);

	useEffect(() => {
		if (!userData || !boardData) return;

		const fetchUsers = async () => {
			try {
				const data = (await request({
					accessToken,
					method: METHODS.GET,
					endpoint: BOARD_ENDPOINTS.COLLEAGUES(boardData.id)
				})) as { users: IUser[] } | { errorMessage: string };

				if ('errorMessage' in data) {
					throw new Error(data.errorMessage);
				}

				const users = data.users.map((user) => ({
					...user,
					username: user.id === userData.id ? 'Me' : user.username,
					profileImagePath: generateImgUrl(user.profileImagePath)
				}));

				const matchingUsers = users.filter((user) =>
					user.username.toLowerCase()
						.includes(inputValues.username.toLowerCase())
				);

				const assignee = matchingUsers.find(
					(user) =>
						user.username.trim().toLowerCase() ===
						inputValues.username.trim().toLowerCase()
				);

				if (isFirstTime) {
					setBoardUsers(users);
					setIsFirstTime(false);
				}

				setMatches(matchingUsers);

				if (assignee) {
					setAssigneeId(assignee.id);
					setMatches([]);
					return;
				}

				setAssigneeId(null);
			} catch (err: any) {
				console.log(err.message);
			}
		};

		fetchUsers();
	}, [accessToken, userData, inputValues.username]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValues((prev) => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	const selectAssignee = (user: IUser) => {
		setAssigneeId(user.id);
		setInputValues((prev) => ({ ...prev, username: user.username }));
	};

	const data: ITaskModalContext = {
		matches,
		assigneeId,
		setMatches,
		inputValues,
		setInputValues,
		selectAssignee,
		handleInputChange
	};
	return (
		<TaskModalContext.Provider value={data}>
			{children}
		</TaskModalContext.Provider>
	);
};
