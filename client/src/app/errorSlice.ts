import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface IErrorState {
    message: string;
    showMsg: boolean;
}

const initialState: IErrorState = {
    message: '',
    showMsg: false
};

const setErrorMessageAsync = createAsyncThunk(
    'error/setErrorMessageAsync',
    async (errorMessage: string, { dispatch }) => {
        // Dispatch the action to set the error message immediately
        dispatch(setErrorMessage(errorMessage));

        // Use a setTimeout to set showErrorMsg to false after 5 seconds
        setTimeout(() => {
            dispatch(hideErrorMsg());
        }, 5000);
    }
);

const errorSlice = createSlice({
    name: 'error-slice',
    initialState,
    reducers: {
        setErrorMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
            state.showMsg = true;
        },
        hideErrorMsg: (state) => {
            state.showMsg = false;
        }
    }
});

export { setErrorMessageAsync };
export const { setErrorMessage, hideErrorMsg } = errorSlice.actions;

export default errorSlice.reducer;
