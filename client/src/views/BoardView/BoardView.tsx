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
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';
import { DeleteConfirmation } from '@/components/DeleteConfirmation/DeleteConfirmation';
import { DragDropContext } from 'react-beautiful-dnd';

export const BoardView = () => {
	const { state, operations } = useBoardViewModel();

	if (!state.boardData || !state.workspaceUsers) {
		return <LoadingOverlay />
	}
	return (

		<>
			{
				state.isEditBoardUsersModalOpen &&
				(
					<Modal>
						<div className={styles.modalContainer}>
							<RxCross2
								className={styles.closeBtn}
								onClick={operations.toggleIsEditBoardUsersModalOpen}
							/>
							<AddColleagueInput
								enableFlex={true}
								title="Board users"
								colleagues={state.boardData.boardUsers}
								addColleagueHandler={operations.addWorkspaceColleague}
								removeColleagueHandler={operations.removeWorkspaceColleague}
								disableDeletionFor={state.workspaceUsers.map(user => user.id)}
							/>
						</div>
					</Modal>
				)
			}
			{
				state.isDeleteBoardModalOpen &&
				(
					<Modal>
						<div className={styles.modalContainer}>
							<RxCross2
								className={styles.closeBtn}
								onClick={operations.toggleIsDeleteBoardModalOpen}
							/>
							<DeleteConfirmation
								entityName={state.boardData.name}
								onConfirm={operations.deleteBoard}
								onCancel={operations.toggleIsDeleteBoardModalOpen}
							/>
						</div>
					</Modal>
				)
			}
			{
				state.isCreateTaskModalOpen &&
				(
					<Modal>
						<CreateTaskView
							boardId={state.boardData.id}
							columnId={state.selectedColumnId}
							toggleIsCreateTaskModalOpen={
								() => operations.toggleIsCreateTaskModalOpen(-1)
							}
							boardUsers={[...state.boardData.boardUsers]}
						/>
					</Modal>
				)
			}

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
					<DragDropContext 
						onDragEnd={operations.onDragEnd}
					>
						<div
							className={
								classNames(
									styles.columnsContainer,
									state.isChatOpen && styles.squash
								)
							}
						>
							{
								state.boardData.columns.map(column =>
									<Column
										id={column.id}
										key={column.id}
										title={column.name}
										tasks={column.tasks}
										callForRefresh={operations.callForRefresh}
										onClick={operations.toggleIsCreateTaskModalOpen}
									/>
								)

							}

						</div>
					</DragDropContext>
				</div>
			</div>
		</>
	);
};
