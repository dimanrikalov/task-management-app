import styles from './listContainer.module.css';
import { UserEntry } from '../UserEntry/UserEntry';
import { StepEntry } from '../StepEntry/StepEntry';
import { IUser } from '../AddColleagueInput/AddColleagueInput';

type TListMode = 'users' | 'steps';

interface IListContainerProps {
	title: string;
	users: IUser[],
	mode: TListMode;
	colleagueIds: number[];
	disableDeletionFor: number[];
	removeUser(id: number): void;
}

export const ListContainer = ({
	title,
	users,
	removeUser,
	colleagueIds,
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
								users.filter(user => colleagueIds.includes(user.id))
									.map(user => {
										if (disableDeletionFor.includes(user.id)) {
											return <UserEntry
												key={user.id}
												showBtn={false}
												email={user.email}
												removeHandler={() => removeUser(user.id)}
											/>
										}
										return <UserEntry
											key={user.id}
											email={user.email}
											removeHandler={() => removeUser(user.id)}
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
