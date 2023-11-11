import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IBoardViewModelState {}

interface IBoardViewModelOperations {}

export const useBoardViewModel = (): ViewModelReturnType<
	IBoardViewModelState,
	IBoardViewModelOperations
> => {
	return {
		state: {},
		operations: {},
	};
};
