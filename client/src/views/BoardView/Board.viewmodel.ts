import { useState } from 'react';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';

interface IBoardViewModelState {
	isChatOpen: boolean;
}

interface IBoardViewModelOperations {
	toggleIsChatOpen(): void;
}

export const useBoardViewModel = (): ViewModelReturnType<
	IBoardViewModelState,
	IBoardViewModelOperations
> => {
	const [isChatOpen, setIsChatOpen] = useState(false);

	const toggleIsChatOpen = () => {
		setIsChatOpen((prev) => !prev);
	};

	return {
		state: {
			isChatOpen,
		},
		operations: {
			toggleIsChatOpen
		},
	};
};
