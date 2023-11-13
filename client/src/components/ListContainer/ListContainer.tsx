import styles from './listContainer.module.css';
import { UserEntry } from '../UserEntry/UserEntry';
import { StepEntry } from '../StepEntry/StepEntry';

type TListMode = 'users' | 'steps';

interface IListContainerProps {
	title: string;
	mode: TListMode;
}

export const ListContainer = ({
	title,
	mode = 'users',
}: IListContainerProps) => {
	return (
		<div className={styles.listContainer}>
			<h2>{title}</h2>
			<div className={styles.list}>
				{mode === 'users' && (
					<>
						<UserEntry email="dimanrikalov1@abv.bg" />
						<UserEntry email="dimanrikalov1@abv.bg" />
						<UserEntry email="dimanrikalov1@abv.bg" />
						<UserEntry email="dimanrikalov1@abv.bg" />
						<UserEntry email="dimanrikalov1@abv.bg" />
						<UserEntry email="dimanrikalov1@abv.bg" />
						<UserEntry email="dimanrikalov1@abv.bg" />
						<UserEntry email="dimanrikalov1@abv.bg" />
						<UserEntry email="dimanrikalov1@abv.bg" />
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
	);
};
