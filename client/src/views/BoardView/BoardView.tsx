import { ROUTES } from '@/router';
import classNames from 'classnames';
import styles from './board.module.css';
import { FaEdit } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { Navigate } from 'react-router-dom';
import { Chat } from '@/components/Chat/Chat';
import { Modal } from '@/components/Modal/Modal';
import { Column } from '@/components/Column/Column';
import { useBoardViewModel } from './Board.viewmodel';
import { BackButton } from '@/components/BackButton/BackButton';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { CreateTaskView } from '../CreateTaskView/CreateTask.view';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { ErrorNotification } from '@/components/ErrorNotification/ErrorNotification';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';
import { DeleteConfirmation } from '@/components/DeleteConfirmation/DeleteConfirmation';

export const BoardView = () => {
	const { state, operations } = useBoardViewModel();

	if (state.isLoading) {
		return <LoadingOverlay />
	}

	if (!state.boardData || !state.workspaceUsers) {
		return <Navigate to={ROUTES.DASHBOARD} />
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
							taskData={state.selectedTask}
							columnId={state.selectedColumnId}
							boardUsers={state.boardData.boardUsers}
							callForRefresh={operations.callForRefresh}
							toggleIsCreateTaskModalOpen={operations.closeCreateTaskModal}
						/>
					</Modal>
				)
			}
			<ErrorNotification
				opacity={state.errorMessageOpacity}
				errorMessage={
					state.errorMessage === 'Column name is taken!' ? `${state.errorMessage} Make sure to rename "New column" if it exists.`
						: state.errorMessage
				}
			/>
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

							{
								state.isInputModeOn ?

									<form
										className={styles.changeNameContainer}
										onSubmit={operations.handleBoardNameChange}
									>
										<IntroInput
											type='text'
											name='board-name-input'
											value={state.boardNameInput}
											placeholder='Enter board name'
											onChange={operations.handleBoardNameInputChange}
										/>
										<button className={styles.submitBtn}>
											<FaEdit className={styles.icon} />
										</button>
									</form>
									:

									<h3 onDoubleClick={operations.toggleIsInputModeOn}>{state.boardData.name}</h3>
							}
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
						<Droppable
							type='column'
							direction='horizontal'
							droppableId='boardDroppable'
						>
							{
								(provider) => (

									<div
										className={
											classNames(
												styles.columnsContainer,
												state.isChatOpen && styles.squash
											)
										}
										ref={provider.innerRef}
										{...provider.droppableProps}
									>

										{
											state.boardData?.columns.map((column, index) =>
												<Column
													index={index}
													id={column.id}
													key={column.id}
													title={column.name}
													tasks={column.tasks}
													onTaskClick={operations.taskClickHandler}
													updateColumn={operations.updateColumnData}
													showErrorMessage={operations.showErrorMessage}
													onClick={operations.toggleIsCreateTaskModalOpen}
													users={[...state.workspaceUsers, ...(state.boardData?.boardUsers || [])]}
												/>
											)
										}

										{provider.placeholder}

										<div className={styles.addColumn}>
											<button
												onClick={operations.addColumn}
												className={styles.addColumnBtn}
											>
												<p>Add column</p>
											</button>
										</div>
									</div>
								)
							}
						</Droppable>
					</DragDropContext>
				</div>
			</div >
		</>
	);
};
