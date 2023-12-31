import { createSlice } from '@reduxjs/toolkit';
import { ITask } from '@/components/Task/Task';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

interface ITaskModalState {
	selectedColumnId: number;
	boardUsers: IUser[];
	isModalOpen: boolean;
	selectedTask: ITask | null;
	callForRefresh: boolean;
}

const initialState: ITaskModalState = {
	selectedColumnId: -1,
	selectedTask: null,
	boardUsers: [],
	isModalOpen: false,
	callForRefresh: true,
};

const taskModalSlice = createSlice({
	name: 'task-modal-slice',
	initialState,
	reducers: {
		resetTaskModalData: () => initialState,
		clearTaskModalData: (state) => ({
			...initialState,
			boardUsers: state.boardUsers,
		}),
		toggleIsModalOpen: (state) => ({
			...state,
			isModalOpen: !state.isModalOpen,
		}),
		setSelectedTask: (state, action) => ({
			...state,
			selectedTask: action.payload.selectedTask,
		}),
		setSelectedColumnId: (state, action) => ({
			...state,
			selectedColumnId: action.payload.selectedColumnId,
		}),
		setBoardUsers: (state, action) => ({
			...state,
			boardUsers: action.payload.boardUsers,
		}),
		setCallForRefresh: (state, action) => ({
			...state,
			callForRefresh: action.payload.callForRefresh,
		}),
	},
});

export const {
	setBoardUsers,
	setSelectedTask,
	toggleIsModalOpen,
	setCallForRefresh,
	resetTaskModalData,
	clearTaskModalData,
	setSelectedColumnId,
} = taskModalSlice.actions;

export default taskModalSlice.reducer;
