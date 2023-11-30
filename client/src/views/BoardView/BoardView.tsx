import classNames from 'classnames';
import styles from './board.module.css';
import { RxCross2 } from 'react-icons/rx';
import { Chat } from '@/components/Chat/Chat';
import { Modal } from '@/components/Modal/Modal';
import { Column } from '@/components/Column/Column';
import { useBoardViewModel } from './Board.viewmodel';
import { BackButton } from '@/components/BackButton/BackButton';
import { CreateTaskView } from '../CreateTaskView/CreateTask.view';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';
import { DeleteConfirmation } from '@/components/DeleteConfirmation/DeleteConfirmation';

export const BoardView = () => {
	const { state, operations } = useBoardViewModel();

	if (!state.boardData) {
		return <h1>Loading...</h1>
	}

	return (
		<>
			{state.isEditBoardUsersModalOpen && (
				<Modal>
					<div className={styles.modalContainer}>
						<RxCross2
							className={styles.closeBtn}
							onClick={operations.toggleIsEditBoardUsersModalOpen}
						/>
						<AddColleagueInput
							colleagueIds={state.boardData.boardUserIds}
							boardMode={false}
							addColleagueHandler={operations.addBoardColleague}
							removeColleagueHandler={operations.removeWorkspaceColleague}
							title="Board users" enableFlex={true}
						/>
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
						<DeleteConfirmation
							onCancel={operations.toggleIsDeleteBoardModalOpen}
							onConfirm={() => { }}
							entityName="Board Name"
						/>
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

							<BackButton onClick={operations.goBack} />

							<h3>{state.boardData.name}</h3>
						</div>
						<div className={styles.operationsContainer}>
							<IntroButton
								message="Edit Users"
								onClick={
									operations.toggleIsEditBoardUsersModalOpen
								}
							/>
							<IntroButton
								message="View Graph"
							/>
							<IntroButton
								message="Delete Board"
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
						{
							state.boardData.columns.map(column => <Column key={column.id}
								title={column.name}
								tasks={column.tasks}
								onClick={operations.toggleIsCreateTaskModalOpen}
							/>)

						}

					</div>
				</div>
			</div>
		</>
	);
};
