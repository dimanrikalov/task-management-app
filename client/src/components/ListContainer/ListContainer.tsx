import styles from './listContainer.module.css';
import { UserEntry } from '../UserEntry/UserEntry';
import { StepEntry } from '../StepEntry/StepEntry';
import { IStep } from '../../hooks/useStepsOperations';
import { IUser } from '../AddColleagueInput/AddColleagueInput';

type TListMode = 'users' | 'steps';

interface IListContainerProps {
	title: string;
	mode: TListMode;
	noMarginBottom?: boolean;
	disableDeletionFor: number[];
	colleagues: IUser[] | IStep[];
	toggleStatus?(colleague: string): void;
	removeUser(colleague: IUser | string): void;
}

export const ListContainer = ({
	title,
	removeUser,
	colleagues,
	toggleStatus,
	mode = 'users',
	disableDeletionFor,
	noMarginBottom = false
}: IListContainerProps) => {
	return (
		<div
			className={styles.listContainer}
			style={{ marginBottom: noMarginBottom ? 0 : 32 }}
		>
			<h2>{title}</h2>
			<div className={styles.listWrapper}>
				<div className={styles.list}>
					{mode === 'users' && (
						<>
							{(colleagues as unknown as IUser[]).map(
								(colleague) => {
									if (
										disableDeletionFor.includes(
											colleague.id
										)
									) {
										return (
											<UserEntry
												showBtn={false}
												key={colleague.id}
												username={colleague.username}
												profileImgPath={
													colleague.profileImagePath
												}
												removeHandler={() =>
													removeUser(colleague)
												}
											/>
										);
									}
									return (
										<UserEntry
											key={colleague.id}
											username={colleague.username}
											profileImgPath={
												colleague.profileImagePath
											}
											removeHandler={() =>
												removeUser(colleague)
											}
										/>
									);
								}
							)}
						</>
					)}
					{mode === 'steps' && (
						<>
							{(colleagues as unknown as IStep[]).map(
								(colleague) => {
									return (
										<StepEntry
											key={colleague.description}
											isCompleted={colleague.isComplete}
											description={colleague.description}
											onClick={() =>
												removeUser(
													colleague.description
												)
											}
											toggleStatus={() =>
												toggleStatus!(
													colleague.description
												)
											}
										/>
									);
								}
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};
