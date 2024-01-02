import { useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { useTaskModalContext } from '@/contexts/taskModal.context';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';

export const useTaskAssigneeOperations = () => {
	//get matches
	const { boardUsers } = useAppSelector((state) => state.taskModal);
	const { inputValues, setInputValues, matches, setMatches, setAssigneeId } =
		useTaskModalContext();

	useEffect(() => {
		const assignee = matches.find(
			(user) =>
				user.email.trim().toLowerCase() ===
				inputValues.email.trim().toLowerCase()
		);

		if (assignee) {
			setAssigneeId(assignee.id);
			setMatches([]);
			return;
		}
		setAssigneeId(null);
		setMatches(
			boardUsers.filter((user) =>
				user.email
					.trim()
					.toLowerCase()
					.includes(inputValues.email.trim().toLowerCase())
			)
		);
	}, [inputValues.email]);

	const selectAssignee = (user: IUser) => {
		setAssigneeId(user.id);
		setInputValues((prev) => ({ ...prev, email: user.email }));
	};

	return {
		selectAssignee,
	};
};
