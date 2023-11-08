import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IUseHomeViewmodelState {}

interface IUserHomeViewmodelOperations {}

export const useHomeViewModel = (): ViewModelReturnType<
	IUseHomeViewmodelState,
	IUserHomeViewmodelOperations
> => {
	const navigate = useNavigate();

	return {
		state: {},
		operations: {},
	};
};
