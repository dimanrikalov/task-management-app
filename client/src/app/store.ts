import userReducer from './userSlice';
import errorReducer from './errorSlice';
import modalsReducer from './modalsSlice';
import taskModalReducer from './taskModalSlice';
import inputValuesReducer from './inputValuesSlice';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

export const store = configureStore({
	reducer: {
		user: userReducer,
		error: errorReducer,
		modals: modalsReducer,
		taskModal: taskModalReducer,
		inputValues: inputValuesReducer,
		// Add other reducers as needed
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
export type AppDispatch = typeof store.dispatch;
