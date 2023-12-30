import { createSlice } from '@reduxjs/toolkit';
import { ITask } from '@/components/Task/Task';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

interface ITaskModalState {
	columnId: number;
	boardUsers: IUser[];
	isModalOpen: boolean;
	taskData: ITask | null;
	callForRefresh: boolean;
}

const initialState: ITaskModalState = {
	columnId: -1,
	taskData: null,
	boardUsers: [],
	isModalOpen: false,
	callForRefresh: false,
};

const taskModalSlice = createSlice({
	name: 'task-modal-slice',
	initialState,
	reducers: {
		toggleModal: (state) => ({
			...state,
			isModalOpen: !state.isModalOpen,
		}),
		clearTaskModalData: () => initialState,
		toggleIsModalOpen: (state) => ({
			...state,
			isModalOpen: state.isModalOpen,
		}),
		setSelectedTask: (state, action) => ({
			...state,
			taskData: action.payload.taskData,
		}),
		setSelectedColumn: (state, action) => ({
			...state,
			columnId: action.payload.columnId,
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
	toggleModal,
	setBoardUsers,
	setSelectedTask,
	toggleIsModalOpen,
	setSelectedColumn,
	setCallForRefresh,
	clearTaskModalData,
} = taskModalSlice.actions;

export default taskModalSlice.reducer;
