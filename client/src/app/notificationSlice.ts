import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface INotificationState {
	message: string;
	showMsg: boolean;
}

const initialState: INotificationState = {
	message: '',
	showMsg: false,
};

const setNotificationMessageAsync = createAsyncThunk(
	'notification/setNotificationMessageAsync',
	async (notificationMessage: string, { dispatch }) => {
		// Dispatch the action to set the notification message immediately
		dispatch(setNotificationMessage(notificationMessage));

		// Use a setTimeout to set showNotificationMsg to false after 5 seconds
		setTimeout(() => {
			dispatch(hideNotificationMsg());
		}, 5000);
	}
);

const notificationSlice = createSlice({
	name: 'notification-slice',
	initialState,
	reducers: {
		setNotificationMessage: (state, action: PayloadAction<string>) => {
			state.message = action.payload;
			state.showMsg = true;
		},
		hideNotificationMsg: (state) => {
			state.showMsg = false;
		},
	},
});

export { setNotificationMessageAsync };
export const { setNotificationMessage, hideNotificationMsg } = notificationSlice.actions;

export default notificationSlice.reducer;
