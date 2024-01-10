import { Modal } from '../Modal/Modal';
import { RxCross2 } from 'react-icons/rx';
import { IntroInput } from '../IntroInput/IntroInput';
import styles from './createWorkspaceModal.module.css';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';
import { AddColleagueInput } from '../AddColleagueInput/AddColleagueInput';
import { useCreateWorkspaceModal } from '../../hooks/useCreateWorkspaceModal';


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
                            <h1>Let's create a workspace!</h1>
                            <p>
                                Boost your productivity by making it easier for
                                everyone to access multiple{' '}
                                <span className={styles.bold}>boards </span>
                                in <span className={styles.bold}>one</span>{' '}
                                shared space.
                            </p>
                        </div>

                        <div className={styles.inputContainer}>
                            <h2>
                                Name your <span>workspace</span>
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
                                    placeholder="Enter a workspace name"
                                />
                                <IntroButton message="Create Workspace" />
                            </form>
                        </div>
                    </div>
                    <div className={styles.rightSide}>
                        <AddColleagueInput
                            colleagues={colleagues}
                            title={'Workspace users list'}
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
