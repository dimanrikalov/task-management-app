import { RxCross2 } from 'react-icons/rx';
import styles from './workspace.module.css';
import { TiDocumentAdd } from 'react-icons/ti';
import { Modal } from '@/components/Modal/Modal';
import { BoardCard } from '@/components/BoardCard/BoardCard';
import { useWorkspaceViewModel } from './Workspace.viewmodel';
import { BackButton } from '@/components/BackButton/BackButton';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { AddColleagueInput } from '@/components/AddColleagueInput/AddColleagueInput';
import { DeleteConfirmation } from '@/components/DeleteConfirmation/DeleteConfirmation';

export const WorkspaceView = () => {
	const { state, operations } = useWorkspaceViewModel();

	return (
		<>
			{state.editColleaguesModalIsOpen && (
				<Modal
					children={
						<div className={styles.modalContainer}>
							<RxCross2
								className={styles.closeBtn}
								onClick={
									operations.toggleEditcolleaguesModalIsOpen
								}
							/>
							<AddColleagueInput title="Edit colleagues" enableFlex={true} />
						</div>
					}
				/>
			)}
			{state.deleteWorkspaceModalIsOpen && (
				<Modal
					children={
						<div className={styles.modalContainer}>
							<RxCross2
								className={styles.closeBtn}
								onClick={
									operations.toggleDeleteWorkspaceModalIsOpen
								}
							/>
							<DeleteConfirmation entityName="My class workspace" />
						</div>
					}
				/>
			)}
			<div className={styles.background}>
				<div className={styles.header}>
					<div className={styles.left}>
						<BackButton onClick={operations.backBtnHandler} />
						<h2>My class workspace</h2>
					</div>
					<div className={styles.right}>
						<IntroButton
							message={'Edit Users'}
							onClick={operations.toggleEditcolleaguesModalIsOpen}
						/>
						<IntroButton

							message={'Delete Workspace'}
							onClick={
								operations.toggleDeleteWorkspaceModalIsOpen
							}
						/>
					</div>
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
					<button className={styles.addButton}>
						<TiDocumentAdd className={styles.icon} />
					</button>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => { }}
						boardName="Board Name"
					/>
				</div>
			</div>
		</>
	);
};
