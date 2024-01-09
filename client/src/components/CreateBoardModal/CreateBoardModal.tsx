import classNames from 'classnames';
import { RxCross2 } from 'react-icons/rx';
import { Modal } from '@/components/Modal/Modal';
import styles from './createBoardModal.module.css';
import { IntroInput } from '@/components/IntroInput/IntroInput';
import { useCreateBoardModal } from '../../hooks/useCreateBoardModal';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { WorkspaceInput } from '@/components/WorkspaceInput/WorkspaceInput';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';

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
                            <h1>Let's create a board!</h1>
                            <p>
                                A <span className={styles.bold}>board</span> is
                                the secret to enhanced productivity and
                                organization. It offers visual clarity and
                                empowers you to stay on top of priorities and
                                efficiently distribute workload between
                                employees.
                            </p>
                        </div>

                        <div className={styles.inputContainer}>
                            <h2>Choose a workspace</h2>
                            <form className={styles.createForm}>
                                <WorkspaceInput
                                    onChange={handleInputChange}
                                    value={inputValues.workspaceName}
                                    chooseWorkspace={selectWorkspace}
                                    accessibleWorkspaces={workspacesData}
                                    disabled={isWorkspaceNameInputDisabled}
                                />
                            </form>
                        </div>

                        <div className={styles.inputContainer}>
                            <h2>
                                Name your <span>board</span>
                            </h2>
                            <form
                                className={styles.createForm}
                                onSubmit={createBoard}
                            >
                                <IntroInput
                                    type="text"
                                    name="boardName"
                                    placeholder="Enter a board name"
                                    value={inputValues.boardName}
                                    onChange={handleInputChange}
                                />
                                <IntroButton message="Create Board" />
                            </form>
                        </div>
                    </div>

                    <div className={styles.rightSide}>
                        <div
                            className={classNames(
                                styles.rightSideContent,
                                (!selectedWorkspace ||
                                    selectedWorkspace.name
                                        .toLowerCase()
                                        .trim() === 'personal workspace') &&
                                    styles.hidden
                            )}
                        >
                            {
                                <AddColleagueInput
                                    title={'Board users list'}
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
