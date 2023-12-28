import { FaEdit } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import styles from './workspace.module.css';
import { TiDocumentAdd } from 'react-icons/ti';
import { Modal } from '@/components/Modal/Modal';
import { BoardCard } from '@/components/BoardCard/BoardCard';
import { BackButton } from '@/components/BackButton/BackButton';
import { CreateBoardView } from '../CreateBoardView/CreateBoard.view';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { MODAL_STATES_KEYS, useWorkspaceViewModel } from './Workspace.viewmodel';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';
import { DeleteConfirmation } from '@/components/DeleteConfirmation/DeleteConfirmation';

export const WorkspaceView = () => {
	const { state, operations } = useWorkspaceViewModel();

	if (!state.workspaceData) {
		return <LoadingOverlay />
	}

	return (
		<>
			{
				state.modals.createBoardIsOpen && (
					<Modal
						children={
							<CreateBoardView
								inputValue={state.workspaceData.name}
								closeBtnHandler={
									() =>
										operations.toggleModal(MODAL_STATES_KEYS.CREATE_BOARD)
								}
							/>
						}
					/>
				)
			}
			{
				state.modals.editColleaguesIsOpen && (
					<Modal
						children={
							<div className={styles.modalContainer}>
								<RxCross2
									className={styles.closeBtn}
									onClick={
										() => operations.toggleModal(MODAL_STATES_KEYS.EDIT_COLLEAGUES)
									}
								/>
								<AddColleagueInput
									enableFlex={true}
									title="Edit colleagues"
									colleagues={state.workspaceData.workspaceUsers}
									addColleagueHandler={operations.addWorkspaceColleague}
									removeColleagueHandler={operations.removeWorkspaceColleague}
									disableDeletionFor={[state.workspaceData.workspaceOwner.id, state.userData.id]}
								/>
							</div>
						}
					/>
				)
			}
			{
				state.modals.deleteWorkspaceIsOpen && (
					<Modal
						children={
							<div className={styles.modalContainer}>
								<RxCross2
									className={styles.closeBtn}
									onClick={
										() => operations.toggleModal(MODAL_STATES_KEYS.DELETE_WORKSPACE)
									}
								/>
								<DeleteConfirmation
									entityName={state.workspaceData.name}
									onConfirm={operations.deleteWorkspace}
									onCancel={
										() => operations.toggleModal(MODAL_STATES_KEYS.DELETE_WORKSPACE)
									}
								/>
							</div>
						}
					/>
				)
			}
			<div className={styles.background}>
				<div className={styles.header}>
					<div className={styles.left}>
						<BackButton onClick={operations.backBtnHandler} />
						{
							state.isInputModeOn ?
								<form
									className={styles.changeNameContainer}
									onSubmit={operations.handleWorkspaceNameChange}
								>
									<IntroInput
										type='text'
										name='workspace-name-input'
										value={state.workspaceNameInput}
										placeholder='Enter workspace name'
										onChange={operations.handleWorkspaceNameInputChange}
									/>
									<button className={styles.submitBtn}>
										<FaEdit className={styles.icon} />
									</button>
								</form>

								:
								<h2 className={styles.workspaceName} onDoubleClick={operations.toggleIsInputModeOn}>{state.workspaceData.name}</h2>
						}
					</div>
					{
						state.workspaceData.name.toLowerCase().trim() !== 'personal workspace' &&
						(
							<div className={styles.right}>
								<IntroButton
									message={'Edit Users'}
									onClick={
										() =>
											operations.toggleModal(MODAL_STATES_KEYS.EDIT_COLLEAGUES)
									}
								/>
								<IntroButton

									message={'Delete Workspace'}
									onClick={
										() => operations.toggleModal(MODAL_STATES_KEYS.DELETE_WORKSPACE)
									}
								/>
							</div>
						)
					}
				</div>
				<div className={styles.titleContainer}>
					<h1>Boards</h1>
					<div className={styles.inputContainer}>
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
						onClick={
							() => operations.toggleModal(MODAL_STATES_KEYS.CREATE_BOARD)
						}
					>
						<TiDocumentAdd className={styles.icon} />
					</button>
					{
						state.filteredBoards.map((board) =>
							<BoardCard
								key={board.id}
								boardName={board.name}
								onClickHandler={
									() => operations.goToBoard(board.id)
								}
							/>
						)
					}
				</div>
			</div>
		</>
	);
};
