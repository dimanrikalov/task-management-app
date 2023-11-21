import classNames from 'classnames';
import styles from './board.module.css';
import { RxCross2 } from 'react-icons/rx';
import { LuUserCog } from 'react-icons/lu';
import { VscGraph } from 'react-icons/vsc';
import { Chat } from '@/components/Chat/Chat';
import { Modal } from '@/components/Modal/Modal';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { Button } from '@/components/Button/Button';
import { Column } from '@/components/Column/Column';
import { useBoardViewModel } from './Board.viewmodel';
import { BackButton } from '@/components/BackButton/BackButton';
import { CreateTaskView } from '../CreateTaskView/CreateTask.view';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';
import { DeleteConfirmation } from '@/components/DeleteConfirmation/DeleteConfirmation';

export const BoardView = () => {
	const { state, operations } = useBoardViewModel();

	return (
		<>
			{state.isEditBoardUsersModalOpen && (
				<Modal>
					<div className={styles.modalContainer}>
						<RxCross2
							className={styles.closeBtn}
							onClick={operations.toggleIsEditBoardUsersModalOpen}
						/>
						<AddColleagueInput title="Board users" enableFlex={true} />
					</div>
				</Modal>
			)}
			{state.isDeleteBoardModalOpen && (
				<Modal>
					<div className={styles.modalContainer}>
						<RxCross2
							className={styles.closeBtn}
							onClick={operations.toggleIsDeleteBoardModalOpen}
						/>
						<DeleteConfirmation entityName="Board Name" />
					</div>
				</Modal>
			)}
			{state.isCreateTaskModalOpen && (
				<Modal>
					<CreateTaskView
						toggleIsCreateTaskModalOpen={
							operations.toggleIsCreateTaskModalOpen
						}
					/>
				</Modal>
			)}

			<div className={styles.background}>
				<Chat
					isChatOpen={state.isChatOpen}
					toggleIsChatOpen={operations.toggleIsChatOpen}
				/>
				<div
					className={classNames(
						styles.boardContainer,
						state.isChatOpen && styles.moveRight
					)}
				>
					<div
						className={classNames(
							styles.header,
							state.isChatOpen && styles.directionColumn
						)}
					>
						<div
							className={classNames(
								styles.titleDiv,
								state.isChatOpen && styles.directionColumn
							)}
						>
							<div className={styles.shadowBackground}>
								<BackButton onClick={operations.goBack} />
							</div>
							<h2>Board Name</h2>
						</div>
						<div className={styles.operationsContainer}>
							<Button
								icon={<LuUserCog size={24} />}
								message="Edit Users"
								maxWidth={220}
								invert={true}
								onClick={
									operations.toggleIsEditBoardUsersModalOpen
								}
							/>
							<Button
								icon={<VscGraph size={24} />}
								message="View Graph"
								maxWidth={220}
								invert={true}
							/>
							<Button
								icon={<RiDeleteBin2Line size={24} />}
								message="Delete Board"
								maxWidth={220}
								invert={true}
								onClick={
									operations.toggleIsDeleteBoardModalOpen
								}
							/>
						</div>
					</div>
					<div
						className={classNames(
							styles.columnsContainer,
							state.isChatOpen && styles.squash
						)}
					>
						<Column
							onClick={operations.toggleIsCreateTaskModalOpen}
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
							onClick={operations.toggleIsCreateTaskModalOpen}
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
							onClick={operations.toggleIsCreateTaskModalOpen}
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
							onClick={operations.toggleIsCreateTaskModalOpen}
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
							onClick={operations.toggleIsCreateTaskModalOpen}
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
		</>
	);
};
