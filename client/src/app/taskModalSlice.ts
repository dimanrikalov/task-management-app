import { createSlice } from '@reduxjs/toolkit';
import { ITask } from '@/components/Task/Task';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

interface ITaskModalState {
	boardUsers: IUser[];
	isModalOpen: boolean;
	callForRefresh: boolean;
	selectedTask: ITask | null;
	selectedColumnId: number | null;
}

const initialState: ITaskModalState = {
	boardUsers: [],
	selectedTask: null,
	isModalOpen: false,
	callForRefresh: true,
	selectedColumnId: null,
};

const taskModalSlice = createSlice({
	name: 'task-modal-slice',
	initialState,
	reducers: {
		clearTaskModalData: (state) => ({
			...initialState,
			boardUsers: state.boardUsers,
		}),
		toggleIsModalOpen: (state) => ({
			...state,
			isModalOpen: !state.isModalOpen,
		}),
		setBoardUsers: (state, action) => ({
			...state,
			boardUsers: action.payload.boardUsers,
		}),
		resetTaskModalData: () => initialState,
		setSelectedTask: (state, action) => ({
			...state,
			selectedTask: action.payload.selectedTask,
		}),
		setCallForRefresh: (state, action) => ({
			...state,
			callForRefresh: action.payload.callForRefresh,
		}),
		setSelectedColumnId: (state, action) => ({
			...state,
			selectedColumnId: action.payload.selectedColumnId,
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
