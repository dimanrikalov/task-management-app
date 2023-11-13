import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface ICreateTaskViewModelState {}

interface ICreateTaskViewModelOperations {}

export const useCreateTaskViewModel = (): ViewModelReturnType<
	ICreateTaskViewModelState,
	ICreateTaskViewModelOperations
> => {
	return {
		state: {},
		operations: {},
	};
};
