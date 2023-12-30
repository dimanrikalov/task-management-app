import { createSlice } from '@reduxjs/toolkit';

interface IInputValuesState {
	workspaceName: string;
}

const initialState: IInputValuesState = {
	workspaceName: '',
};

const inputValuesState = createSlice({
	name: 'input-values-slice',
	initialState,
	reducers: {
		setWorkspaceName: (state, action) => ({
			...state,
			workspaceName: action.payload.workspaceName,
		}),
	},
});

export const { setWorkspaceName } = inputValuesState.actions;

export default inputValuesState.reducer;
