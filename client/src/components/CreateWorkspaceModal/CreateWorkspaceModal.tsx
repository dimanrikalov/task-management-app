import { Modal } from '../Modal/Modal';
import { RxCross2 } from 'react-icons/rx';
import { IntroInput } from '../IntroInput/IntroInput';
import styles from './createWorkspaceModal.module.css';
import { useTranslate } from '../../hooks/useTranslate';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';
import { AddColleagueInput } from '../AddColleagueInput/AddColleagueInput';
import { useCreateWorkspaceModal } from '../../hooks/useCreateWorkspaceModal';

const translationPaths = {
	title: 'createWorkspace.title',
	create: 'createWorkspace.create',
	message: 'createWorkspace.message',
	nameWorkspace: 'createWorkspace.nameWorkspace',
	usersWithAccess: 'createWorkspace.usersWithAccess',
	enterWorkspaceName: 'components.inputs.enterWorkspaceName'
}

export const CreateWorkspaceModal = () => {
	const {
		userData,
		colleagues,
		inputValue,
		createWorkspace,
		handleInputChange,
		addToColleaguesToAdd,
		removeFromColleaguesToAdd,
		toggleIsCreateWorkspaceModalOpen
	} = useCreateWorkspaceModal();
	const { t } = useTranslate();

	return (
		<Modal>
			<div className={styles.backgroundWrapper}>
				<div className={styles.background}>
					<RxCross2
						className={styles.closeBtn}
						onClick={toggleIsCreateWorkspaceModalOpen}
					/>
					<div className={styles.leftSide}>
						<div className={styles.introMessage}>
							<h1>{t(translationPaths.title)}</h1>
							<p>
								{t(translationPaths.message)}
							</p>
						</div>

						<div className={styles.inputContainer}>
							<h2>
								{t(translationPaths.nameWorkspace)}
							</h2>
							<form
								className={styles.createForm}
								onSubmit={createWorkspace}
							>
								<IntroInput
									type="text"
									value={inputValue}
									name="workspace-name"
									onChange={handleInputChange}
									placeholder={t(translationPaths.enterWorkspaceName)}
								/>
								<IntroButton message={t(translationPaths.create)} />
							</form>
						</div>
					</div>
					<div className={styles.rightSide}>
						<AddColleagueInput
							colleagues={colleagues}
							title={t(translationPaths.usersWithAccess)}
							disableDeletionFor={[userData.id]}
							addColleagueHandler={addToColleaguesToAdd}
							removeColleagueHandler={removeFromColleaguesToAdd}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};
