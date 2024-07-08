import classNames from 'classnames';
import { Modal } from '../Modal/Modal';
import { RxCross2 } from 'react-icons/rx';
import styles from './createBoardModal.module.css';
import { IntroInput } from '../IntroInput/IntroInput';
import { useTranslate } from '../../hooks/useTranslate';
import { WorkspaceInput } from '../WorkspaceInput/WorkspaceInput';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';
import { useCreateBoardModal } from '../../hooks/useCreateBoardModal';
import { AddColleagueInput } from '../AddColleagueInput/AddColleagueInput';

const basePath = 'createBoard';

const translationPaths = {
	title: `${basePath}.title`,
	create: `${basePath}.create`,
	message: `${basePath}.message`,
	nameYourBoard: `${basePath}.nameYourBoard`,
	boardUsersList: `${basePath}.boardUsersList`,
	enterBoardName: `${basePath}.enterBoardName`,
	chooseWorkspace: `${basePath}.chooseWorkspace`,
	enterWorkspaceName: `${basePath}.enterWorkspaceName`,
}

export const CreateBoardModal = () => {
	const {
		inputValues,
		createBoard,
		workspacesData,
		boardColleagues,
		selectWorkspace,
		addBoardColleague,
		handleInputChange,
		selectedWorkspace,
		removeBoardColleague,
		toggleIsCreateBoardModalOpen,
		isWorkspaceNameInputDisabled
	} = useCreateBoardModal();
	const { t } = useTranslate()

	return (
		<Modal>
			<div className={styles.backgroundWrapper}>
				<RxCross2
					className={styles.closeBtn}
					onClick={toggleIsCreateBoardModalOpen}
				/>
				<div className={styles.background}>
					<div className={styles.leftSide}>
						<div className={styles.introMessage}>
							<h1>{t(translationPaths.title)}</h1>
							<p>{t(translationPaths.message)}</p>
						</div>

						<div className={styles.inputContainer}>
							<h2>{t(translationPaths.chooseWorkspace)}</h2>
							<form className={styles.createForm}>
								<WorkspaceInput
									onChange={handleInputChange}
									value={inputValues.workspaceName}
									chooseWorkspace={selectWorkspace}
									accessibleWorkspaces={workspacesData}
									disabled={isWorkspaceNameInputDisabled}
									placeholder={t(translationPaths.enterWorkspaceName)}
								/>
							</form>
						</div>

						<div className={styles.inputContainer}>
							<h2>{t(translationPaths.nameYourBoard)}</h2>
							<form
								className={styles.createForm}
								onSubmit={createBoard}
							>
								<IntroInput
									type="text"
									name="boardName"
									placeholder={t(translationPaths.enterBoardName)}
									value={inputValues.boardName}
									onChange={handleInputChange}
								/>
								<IntroButton message={t(translationPaths.create)} />
							</form>
						</div>
					</div>

					<div className={styles.rightSide}>
						<div
							// className={classNames(
							// 	styles.rightSideContent,
							// 	!selectedWorkspace && styles.hidden
							// )}
						className={classNames(
							styles.rightSideContent,
							(!selectedWorkspace 
								||
								selectedWorkspace.name
									.toLowerCase()
									.trim() === 'лично работно пространство')
									 &&
							styles.hidden
						)}
						>
							{
								<AddColleagueInput
									title={t(translationPaths.boardUsersList)}
									addColleagueHandler={addBoardColleague}
									removeColleagueHandler={
										removeBoardColleague
									}
									colleagues={[
										...(selectedWorkspace?.workspaceUsers ||
											[]),
										...boardColleagues
									]}
									disableDeletionFor={selectedWorkspace?.workspaceUsers.map(
										(colleague) => colleague.id
									)}
								/>
							}
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};
