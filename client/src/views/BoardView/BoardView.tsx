import styles from './board.module.css';
import { Button } from '@/components/Button/Button';
import { Column } from '@/components/Column/Column';
import { useBoardViewModel } from './Board.viewmodel';
import { BackButton } from '@/components/BackButton/BackButton';

export const BoardView = () => {
	const {} = useBoardViewModel();

	return (
		<div className={styles.background}>
			{/* To Do */}
			{/* <div className={styles.chatContainer}></div> */}
			<div className={styles.boardContainer}>
				<div className={styles.header}>
					<div className={styles.titleDiv}>
						<BackButton onClick={() => {}} />
						<h2>Board Name</h2>
					</div>
					<div className={styles.operationsContainer}>
						<Button
							message="Edit Users"
							maxWidth={220}
							invert={true}
						/>
						<Button
							message="Estimation Graph"
							maxWidth={220}
							invert={true}
						/>
						<Button
							message="Delete Board"
							maxWidth={220}
							invert={true}
						/>
					</div>
				</div>
				<div className={styles.columnsContainer}>
					<Column
						title="To Do"
						tasks={[
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							
							
							
							{
								title: 'Fix modal not opening',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Medium',
								stepsComplete: 1,
								totalSteps: 2,
							},
							{
								title: 'Animation not showing',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Low',
								taskImg: 'imgs/home-img.png',
								stepsComplete: 0,
								totalSteps: 1,
							},
						]}
					/>
					<Column
						title="To Do"
						tasks={[
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							{
								title: 'Fix modal not opening',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Medium',
								stepsComplete: 1,
								totalSteps: 2,
							},
							{
								title: 'Animation not showing',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Low',
								taskImg: 'imgs/home-img.png',
								stepsComplete: 0,
								totalSteps: 1,
							},
						]}
					/>
					<Column
						title="To Do"
						tasks={[
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							{
								title: 'Fix modal not opening',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Medium',
								stepsComplete: 1,
								totalSteps: 2,
							},
							{
								title: 'Animation not showing',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Low',
								taskImg: 'imgs/home-img.png',
								stepsComplete: 0,
								totalSteps: 1,
							},
						]}
					/>
					<Column
						title="To Do"
						tasks={[
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							{
								title: 'Fix modal not opening',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Medium',
								stepsComplete: 1,
								totalSteps: 2,
							},
							{
								title: 'Animation not showing',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Low',
								taskImg: 'imgs/home-img.png',
								stepsComplete: 0,
								totalSteps: 1,
							},
						]}
					/>
					<Column
						title="To Do"
						tasks={[
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							{
								title: 'Fix modal not opening',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Medium',
								stepsComplete: 1,
								totalSteps: 2,
							},
							{
								title: 'Animation not showing',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Low',
								taskImg: 'imgs/home-img.png',
								stepsComplete: 0,
								totalSteps: 1,
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
};
