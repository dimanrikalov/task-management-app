import classNames from 'classnames';
import { ROUTES } from '../../router';
import styles from './board.module.css';
import { RxCross2 } from 'react-icons/rx';
import { VscGraph } from 'react-icons/vsc';
import { FaUsersCog } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import { FcAddColumn } from 'react-icons/fc';
import { MdDeleteForever } from 'react-icons/md';
import { Chat } from '../../components/Chat/Chat';
import { Modal } from '../../components/Modal/Modal';
import { useBoardViewModel } from './Board.viewmodel';
import { Column } from '../../components/Column/Column';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { BackButton } from '../../components/BackButton/BackButton';
import { TaskModalContextProvider } from '../../contexts/taskModal.context';
import { LoadingOverlay } from '../../components/LoadingOverlay/LoadingOverlay';
import { AddColleagueInput } from '../../components/AddColleagueInput/AddColleagueInput';
import { DeleteConfirmation } from '../../components/DeleteConfirmation/DeleteConfirmation';
import { TaskOperationsModal } from '../../components/TaskOperationsModal/TaskOperationsModal';
import { EntryModificationForm } from '../../components/EntryModificationForm/EntryModificationForm';
import { EntryModificationButton } from '../../components/Buttons/EntryModificationButton/EntryModificationButton';

export const BoardView = () => {
	const { state, operations } = useBoardViewModel();

	if (state.isLoading) {
		return <LoadingOverlay />;
	}

	if (!state.boardData || !state.workspaceUsers) {
		return <Navigate to={ROUTES.DASHBOARD} />;
	}

	return (
		<>
			{state.isTaskModalOpen && (
				<TaskModalContextProvider>
					<TaskOperationsModal />
				</TaskModalContextProvider>
			)}
			{state.isEditBoardUsersModalOpen && (
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
							addColleagueHandler={operations.addBoardColleague}
							removeColleagueHandler={
								operations.removeBoardColleague
							}
							disableDeletionFor={state.workspaceUsers.map(
								(user) => user.id
							)}
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
							entityName={state.boardData.name}
							onConfirm={operations.deleteBoard}
							onCancel={operations.toggleIsDeleteBoardModalOpen}
						/>
					</div>
				</Modal>
			)}
			<div className={styles.background}>
				<Chat
					isChatOpen={state.isChatOpen}
					boardUsers={state.boardData.boardUsers}
					toggleIsChatOpen={operations.toggleIsChatOpen}
				/>
				<div
					className={classNames(
						styles.boardContainer,
						state.isChatOpen && styles.moveRight
					)}
				>
					<div className={styles.header}>
						<div className={styles.titleDiv}>
							{state.isInputModeOn ? (
								<EntryModificationForm
									name="board-name-input"
									value={state.boardNameInput}
									placeholder="Enter board name"
									onSubmit={operations.handleBoardNameChange}
									onChange={
										operations.handleBoardNameInputChange
									}
								/>
							) : (
								<h2
									className={styles.boardName}
									onDoubleClick={
										operations.toggleIsInputModeOn
									}
								>
									{state.boardData.name}
								</h2>
							)}
						</div>
						<div className={styles.operationsContainer}>
							<BackButton onClick={operations.goBack} />
							{state.boardData.workspace.name !==
								'Personal Workspace' && (
								<EntryModificationButton
									onClick={
										operations.toggleIsEditBoardUsersModalOpen
									}
								>
									<FaUsersCog
										className={styles.icon}
										size={24}
									/>
								</EntryModificationButton>
							)}
							<EntryModificationButton onClick={() => {}}>
								<VscGraph
									size={22}
									className={classNames(
										styles.icon,
										styles.graphIcon
									)}
								/>
							</EntryModificationButton>
							<EntryModificationButton
								onClick={
									operations.toggleIsDeleteBoardModalOpen
								}
							>
								<MdDeleteForever
									className={styles.icon}
									size={26}
								/>
							</EntryModificationButton>
						</div>
					</div>
					<DragDropContext
						onDragEnd={operations.onDragEnd}
						onDragStart={operations.onDragStart}
					>
						<Droppable
							type="column"
							direction="horizontal"
							droppableId="boardDroppable"
						>
							{(provider) => (
								<div
									ref={provider.innerRef}
									{...provider.droppableProps}
									className={styles.columnsContainer}
								>
									{state.boardData?.columns
										.sort(
											(col1, col2) =>
												col1.position - col2.position
										)
										.map((column, index) => (
											<Column
												index={index}
												id={column.id}
												key={column.id}
												title={column.name}
												tasks={column.tasks}
												users={state.allUsers}
												hasDragStarted={
													state.hasDragStarted
												}
												shouldConfettiExplode={
													state.shouldConfettiExplode
												}
											/>
										))}

									{provider.placeholder}

									<div className={styles.addColumn}>
										<button
											onClick={operations.addColumn}
											className={styles.addColumnBtn}
										>
											<FcAddColumn size={92} />
										</button>
									</div>
								</div>
							)}
						</Droppable>
					</DragDropContext>
				</div>
			</div>
		</>
	);
};
