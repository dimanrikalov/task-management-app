import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface ICreateBoardViewModelState {}

interface ICreateBoardViewModelOperations {}

export const useCreateBoardViewModel = (): ViewModelReturnType<
	ICreateBoardViewModelState,
	ICreateBoardViewModelOperations
> => {
	return {
		state: {},
		operations: {},
	};
};
