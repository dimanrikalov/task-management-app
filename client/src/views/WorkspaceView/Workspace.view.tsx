import {
	MODAL_STATES_KEYS,
	useWorkspaceViewModel
} from './Workspace.viewmodel';
import { RxCross2 } from 'react-icons/rx';
import styles from './workspace.module.css';
import { FaUsersCog } from 'react-icons/fa';
import { HiDocumentAdd } from 'react-icons/hi';
import { MdDeleteForever } from 'react-icons/md';
import { Modal } from '../../components/Modal/Modal';
import { BoardCard } from '../../components/BoardCard/BoardCard';
import { IntroInput } from '../../components/IntroInput/IntroInput';
import { BackButton } from '../../components/BackButton/BackButton';
import { LoadingOverlay } from '../../components/LoadingOverlay/LoadingOverlay';
import { AddColleagueInput } from '../../components/AddColleagueInput/AddColleagueInput';
import { DeleteConfirmation } from '../../components/DeleteConfirmation/DeleteConfirmation';
import { EntryModificationForm } from '../../components/EntryModificationForm/EntryModificationForm';
import { EntryModificationButton } from '../../components/Buttons/EntryModificationButton/EntryModificationButton';

export const WorkspaceView = () => {
	const { state, operations } = useWorkspaceViewModel();

	if (state.isLoading) {
		return <LoadingOverlay />;
	}

	if (!state.workspaceData) {
		operations.backBtnHandler();
		return null;
	}

	return (
		<>
			{state.modals.editColleaguesIsOpen && (
				<Modal
					children={
						<div className={styles.modalContainer}>
							<RxCross2
								className={styles.closeBtn}
								onClick={() =>
									operations.toggleModal(
										MODAL_STATES_KEYS.EDIT_COLLEAGUES
									)
								}
							/>
							<AddColleagueInput
								enableFlex={true}
								title="Edit colleagues"
								colleagues={state.workspaceData.workspaceUsers}
								addColleagueHandler={
									operations.addWorkspaceColleague
								}
								removeColleagueHandler={
									operations.removeWorkspaceColleague
								}
								disableDeletionFor={[
									state.workspaceData.workspaceOwner.id,
									state.userData.id
								]}
							/>
						</div>
					}
				/>
			)}
			{state.modals.deleteWorkspaceIsOpen && (
				<Modal
					children={
						<div className={styles.modalContainer}>
							<RxCross2
								className={styles.closeBtn}
								onClick={() =>
									operations.toggleModal(
										MODAL_STATES_KEYS.DELETE_WORKSPACE
									)
								}
							/>
							<DeleteConfirmation
								entityName={state.workspaceData.name}
								onConfirm={operations.deleteWorkspace}
								onCancel={() =>
									operations.toggleModal(
										MODAL_STATES_KEYS.DELETE_WORKSPACE
									)
								}
							/>
						</div>
					}
				/>
			)}
			<div className={styles.background}>
				<div className={styles.header}>
					<div className={styles.left}>
						{state.isInputModeOn ? (
							<EntryModificationForm
								name="workspace-name-input"
								value={state.workspaceNameInput}
								placeholder="Enter workspace name"
								onSubmit={operations.handleWorkspaceNameChange}
								onChange={
									operations.handleWorkspaceNameInputChange
								}
							/>
						) : state.workspaceData.name.toLowerCase().trim() !==
						  'personal workspace' ? (
							<h2
								className={styles.workspaceName}
								onDoubleClick={operations.toggleIsInputModeOn}
							>
								{state.workspaceData.name}
							</h2>
						) : (
							<h2>{state.workspaceData.name}</h2>
						)}
					</div>
					<div className={styles.operationsContainer}>
						<BackButton onClick={operations.backBtnHandler} />
						{state.workspaceData.name.toLowerCase().trim() !==
							'personal workspace' && (
							<>
								<EntryModificationButton
									onClick={() =>
										operations.toggleModal(
											MODAL_STATES_KEYS.EDIT_COLLEAGUES
										)
									}
								>
									<FaUsersCog
										className={styles.icon}
										size={24}
									/>
								</EntryModificationButton>
								<EntryModificationButton
									onClick={() =>
										operations.toggleModal(
											MODAL_STATES_KEYS.DELETE_WORKSPACE
										)
									}
								>
									<MdDeleteForever
										className={styles.icon}
										size={26}
									/>
								</EntryModificationButton>
							</>
						)}
					</div>
				</div>
				<div className={styles.titleContainer}>
					<h1>Boards</h1>
					<div>
						<IntroInput
							type="text"
							name="board-name-input"
							value={state.inputValue}
							placeholder="Search by board name"
							onChange={operations.inputChangeHandler}
						/>
					</div>
				</div>
				<div className={styles.boardsContainer}>
					<button
						className={styles.addButton}
						onClick={operations.toggleIsCreateBoardModalOpen}
					>
						<HiDocumentAdd className={styles.icon} />
					</button>
					{state.filteredBoards.map((board) => (
						<BoardCard
							key={board.id}
							boardName={board.name}
							onClickHandler={() =>
								operations.goToBoard(board.id)
							}
						/>
					))}
				</div>
			</div>
		</>
	);
};
