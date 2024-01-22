import { ITask } from '../components/Task/Task';
import { useConfetti } from '../hooks/useConfetti';
import { createContext, useContext, useState } from 'react';
import { IUser } from '../components/AddColleagueInput/AddColleagueInput';
import { IBoardData, useFetchBoardData } from '../hooks/useFetchBoardData';

interface IBoardContext {
	isLoading: boolean;
	callForRefresh(): void;
	workspaceUsers: IUser[];
	callForConfetti(): void;
	isTaskModalOpen: boolean;
	selectedTask: ITask | null;
	boardData: IBoardData | null;
	toggleIsTaskModalOpen(): void;
	shouldConfettiExplode: boolean;
	selectedColumnId: number | null;
	setSelectedTask: React.Dispatch<React.SetStateAction<ITask | null>>;
	setBoardData: React.Dispatch<React.SetStateAction<IBoardData | null>>;
	setSelectedColumnId: React.Dispatch<React.SetStateAction<number | null>>;
}

const BoardContext = createContext<any>(null);

export const useBoardContext = () => useContext<IBoardContext>(BoardContext);

export const BoardContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const { callForConfetti, shouldConfettiExplode } = useConfetti();
	const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
	const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
	const [selectedColumnId, setSelectedColumnId] = useState<number | null>(
		null
	);
	const {
		boardData,
		isLoading,
		setBoardData,
		workspaceUsers,
		callForRefresh
	} = useFetchBoardData();
	const toggleIsTaskModalOpen = () => {
		setIsTaskModalOpen((prev) => !prev);
	};

	const data = {
		boardData,
		isLoading,
		setBoardData,
		selectedTask,
		callForRefresh,
		workspaceUsers,
		callForConfetti,
		setSelectedTask,
		isTaskModalOpen,
		selectedColumnId,
		setSelectedColumnId,
		shouldConfettiExplode,
		toggleIsTaskModalOpen
	};

	return (
		<BoardContext.Provider value={data}>{children}</BoardContext.Provider>
	);
};
