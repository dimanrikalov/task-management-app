import styles from './listContainer.module.css';
import { UserEntry } from '../UserEntry/UserEntry';
import { StepEntry } from '../StepEntry/StepEntry';
import { IUser } from '../AddColleagueInput/AddColleagueInput';

type TListMode = 'users' | 'steps';

interface IListContainerProps {
	title: string;
	mode: TListMode;
	colleagues: IUser[];
	disableDeletionFor: number[];
	removeUser(colleague: IUser): void;
}

export const ListContainer = ({
	title,
	removeUser,
	colleagues,
	mode = 'users',
	disableDeletionFor,
}: IListContainerProps) => {
	return (
		<div className={styles.listContainer}>
			<h2>{title}</h2>
			<div className={styles.listWrapper}>
				<div className={styles.list}>
					{mode === 'users' && (
						<>
							{
								colleagues
									.map(colleague => {
										if (disableDeletionFor.includes(colleague.id)) {
											return <UserEntry
												key={colleague.id}
												showBtn={false}
												email={colleague.email}
												removeHandler={() => removeUser(colleague)}
											/>
										}
										return <UserEntry
											key={colleague.id}
											email={colleague.email}
											removeHandler={() => removeUser(colleague)}
										/>
									})
							}
						</>
					)}
					{mode === 'steps' && (
						<>
							<StepEntry description={'Create Step Entries'} isCompleted={false} />
							<StepEntry description={'Create User Entries'} isCompleted={false} />
							<StepEntry description={'Create Step Entries'} isCompleted={false} />
							<StepEntry description={'Create User Entries'} isCompleted={false} />
							<StepEntry description={'Create Step Entries'} isCompleted={false} />
							<StepEntry description={'Create User Entries'} isCompleted={false} />
							<StepEntry description={'Create Step Entries'} isCompleted={false} />
							<StepEntry description={'Create User Entries'} isCompleted={false} />
							<StepEntry description={'Create Step Entries'} isCompleted={false} />
							<StepEntry description={'Create User Entries'} isCompleted={false} />
						</>
					)}
				</div>
			</div>
		</div>
	);
};
