import { ITask } from '../components/Task/Task';
import { useConfetti } from '../hooks/useConfetti';
import { createContext, useContext, useState } from 'react';
import { IUser } from '../components/AddColleagueInput/AddColleagueInput';
import { IBoardData, useFetchBoardData } from '../hooks/useFetchBoardData';

interface IBoardContext {
	isLoading: boolean;
	blockRefetch(): void;
	unblockRefetch(): void;
	callForRefetch(): void;
	workspaceUsers: IUser[];
	callForConfetti(): void;
	isTaskModalOpen: boolean;
	selectedTask: ITask | null;
	boardData: IBoardData | null;
	toggleIsTaskModalOpen(): void;
	shouldConfettiExplode: boolean;
	selectedColumnId: number | null;
	selectedColumnName: string | null;
	setSelectedTask: React.Dispatch<React.SetStateAction<ITask | null>>;
	setBoardData: React.Dispatch<React.SetStateAction<IBoardData | null>>;
	setSelectedColumnId: React.Dispatch<React.SetStateAction<number | null>>;
	setSelectedColumnName: React.Dispatch<React.SetStateAction<string | null>>;
}

const BoardContext = createContext<any>(null);

export const useBoardContext = () => useContext<IBoardContext>(BoardContext);

export const BoardContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const {
		boardData,
		isLoading,
		setBoardData,
		blockRefetch,
		unblockRefetch,
		workspaceUsers,
		callForRefetch,
	} = useFetchBoardData();
	const { callForConfetti, shouldConfettiExplode } = useConfetti();
	const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
	const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
	const [selectedColumnName, setSelectedColumnName] = useState<string | null>(null);
	const [selectedColumnId, setSelectedColumnId] = useState<number | null>(
		null
	);

	const toggleIsTaskModalOpen = () => {
		setIsTaskModalOpen((prev) => !prev);
	};

	const data = {
		boardData,
		isLoading,
		setBoardData,
		blockRefetch,
		selectedTask,
		unblockRefetch,
		callForRefetch,
		workspaceUsers,
		callForConfetti,
		setSelectedTask,
		isTaskModalOpen,
		selectedColumnId,
		selectedColumnName,
		setSelectedColumnId,
		setSelectedColumnName,
		shouldConfettiExplode,
		toggleIsTaskModalOpen
	};

	return (
		<BoardContext.Provider value={data}>{children}</BoardContext.Provider>
	);
};
