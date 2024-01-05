import userReducer from './userSlice';
import errorReducer from './errorSlice';
import modalsReducer from './modalsSlice';
import inputValuesReducer from './inputValuesSlice';
import notificationReducer from './notificationSlice';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        user: userReducer,
        error: errorReducer,
        modals: modalsReducer,
        inputValues: inputValuesReducer,
        notification: notificationReducer
        // Add other reducers as needed
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
export type AppDispatch = typeof store.dispatch;
