import { createSlice } from '@reduxjs/toolkit';

interface IModalsState {
	showCreateTaskModal: boolean;
	showEditProfileModal: boolean;
	showCreateBoardModal: boolean;
	showCreateWorkspaceModal: boolean;
}

const initialState: IModalsState = {
	showCreateTaskModal: false,
	showEditProfileModal: false,
	showCreateBoardModal: false,
	showCreateWorkspaceModal: false,
};

const modalsSlice = createSlice({
	name: 'modals-slice',
	initialState,
	reducers: {
		toggleCreateTaskModal: (state) => {
			state.showCreateTaskModal = !state.showCreateTaskModal;
		},
		toggleEditProfileModal: (state) => {
			state.showEditProfileModal = !state.showEditProfileModal;
		},
		toggleCreateBoardModal: (state) => {
			state.showCreateBoardModal = !state.showCreateBoardModal;
		},
		toggleCreateWorkspaceModal: (state) => {
			state.showCreateWorkspaceModal = !state.showCreateWorkspaceModal;
		},
	},
});

export const {
	toggleCreateTaskModal,
	toggleCreateBoardModal,
	toggleEditProfileModal,
	toggleCreateWorkspaceModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
