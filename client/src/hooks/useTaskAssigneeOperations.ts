import { useEffect } from 'react';
import { useBoardContext } from '../contexts/board.context';
import { useTaskModalContext } from '../contexts/taskModal.context';
import { IUser } from '../components/AddColleagueInput/AddColleagueInput';

export const useTaskAssigneeOperations = () => {
	const {
		matches,
		setMatches,
		assigneeId,
		inputValues,
		setAssigneeId,
		setInputValues
	} = useTaskModalContext();
	const { boardData } = useBoardContext();
	const boardUsers = boardData?.boardUsers || [];

	useEffect(() => {
		if (assigneeId) {
			setMatches([]);
			return;
		}
		setMatches(boardUsers);
	}, [assigneeId]);

	useEffect(() => {
		const assignee = matches.find(
			(user) =>
				user.username.trim().toLowerCase() ===
				inputValues.username.trim().toLowerCase()
		);

		if (assignee) {
			setAssigneeId(assignee.id);
			return;
		}
		setAssigneeId(null);
	}, [inputValues.username]);

	const selectAssignee = (user: IUser) => {
		setAssigneeId(user.id);
		setInputValues((prev) => ({ ...prev, username: user.username }));
	};

	return { selectAssignee };
};
