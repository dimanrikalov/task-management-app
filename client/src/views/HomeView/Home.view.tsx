import styles from './home.module.css';
import { TbLogout2 } from 'react-icons/tb';
import { useHomeViewModel } from './Home.viewmodel';
import { HorizontalList } from '@/components/HorizontalList/HorizontalList';
import { OperationsRibbon } from '@/components/OperationsRibbon/OperationsRibbon';

export const HomeView = () => {
	const { state, operations } = useHomeViewModel();

	return (
		<div className={styles.background}>
			<OperationsRibbon
				isOpen={state.isMenuVisible}
				toggle={operations.toggleMenu}
			/>
			<div className={styles.mainContainer}>
				<div className={styles.header}>
					<div className={styles.dashboard}>
						<h3>Dashboard</h3>
						<h5>Tuesday, 17 October 2023</h5>
					</div>
					<div className={styles.userData}>
						<div className={styles.userInitialsIcon}>DR</div>
						<p className={styles.fullName}>Diman Rikalov</p>
						{/* <BackButton reverse={true} onClick={() => {}} /> */}
						<TbLogout2 className={styles.logout} />
					</div>
				</div>
				<div className={styles.lists}>
					<HorizontalList title="My Boards" />
					<HorizontalList title="My Boards" />
					<HorizontalList title="My Boards" />
				</div>
			</div>
		</div>
	);
};
