import styles from './home.module.css';
import { TbLogout2 } from 'react-icons/tb';
import { useHomeViewModel } from './Home.viewmodel';
import { HomeCard } from '@/components/HomeCard/HomeCard';
import { HomeGridStats } from '@/components/HomeGridStats/HomeGridStats';
import { HorizontalList } from '@/components/HorizontalList/HorizontalList';
import { OperationsRibbon } from '@/components/OperationsRibbon/OperationsRibbon';

export const HomeView = () => {
	const {} = useHomeViewModel();

	return (
		<div className={styles.background}>
			<OperationsRibbon />
			<div className={styles.mainContainer}>
				<div className={styles.header}>
					<div className={styles.dashboard}>
						<h3>Dashboard</h3>
						<h5>Tuesday, 17 October 2023</h5>
					</div>
					<div className={styles.userData}>
						<div className={styles.userInitialsIcon}>DR</div>
						<p className={styles.fullName}>Diman Rikalov</p>
						<TbLogout2
							className={styles.logout}
							onClick={() => {}}
						/>
					</div>
				</div>
				<div className={styles.lists}>
					<HomeGridStats />
					<HorizontalList
						title="Performance Overview"
						showSearchInput={false}
					>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>{' '}
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
					</HorizontalList>
					<HorizontalList
						title="Performance Overview"
						showSearchInput={false}
					>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>{' '}
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
						<HomeCard
							onClick={() => {}}
							title="Board Name"
							subtitle="Workspace Name"
							userCount={16}
						/>
					</HorizontalList>
				</div>
			</div>
		</div>
	);
};
