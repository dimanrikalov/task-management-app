import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IUseHomeViewmodelState {
	isMenuVisible: boolean;
}

interface IUserHomeViewmodelOperations {
	toggleMenu(): void;
}

export const useHomeViewModel = (): ViewModelReturnType<
	IUseHomeViewmodelState,
	IUserHomeViewmodelOperations
> => {
	const navigate = useNavigate();
	const [isMenuVisible, setIsMenuVisible] = useState(true);

	const toggleMenu = () => {
		setIsMenuVisible((prev) => !prev);
	};

	return {
		state: { isMenuVisible },
		operations: { toggleMenu },
	};
};
