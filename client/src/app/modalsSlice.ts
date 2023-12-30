import { createSlice } from '@reduxjs/toolkit';

interface IModalsState {
	showEditProfileModal: boolean;
	showCreateBoardModal: boolean;
	showCreateWorkspaceModal: boolean;
}

const initialState: IModalsState = {
	showEditProfileModal: false,
	showCreateBoardModal: false,
	showCreateWorkspaceModal: false,
};

const modalsSlice = createSlice({
	name: 'modals-slice',
	initialState,
	reducers: {
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
	toggleCreateBoardModal,
	toggleEditProfileModal,
	toggleCreateWorkspaceModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
