import errorReducer from './errorSlice';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

export const store = configureStore({
	reducer: {
		error: errorReducer,
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
