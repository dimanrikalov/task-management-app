import { RxCross2 } from 'react-icons/rx';
import { LuUserCog } from 'react-icons/lu';
import styles from './workspace.module.css';
import { TiDocumentAdd } from 'react-icons/ti';
import { Modal } from '@/components/Modal/Modal';
import { Input } from '@/components/Input/Input';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { Button } from '@/components/Button/Button';
import { BoardCard } from '@/components/BoardCard/BoardCard';
import { useWorkspaceViewModel } from './Workspace.viewmodel';
import { BackButton } from '@/components/BackButton/BackButton';
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
							<AddColleagueInput title="Edit colleagues" />
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
						<Button
							icon={<LuUserCog className={styles.icon} />}
							message={'Edit Users'}
							onClick={operations.toggleEditcolleaguesModalIsOpen}
							invert={true}
						/>
						<Button
							icon={<RiDeleteBin2Line className={styles.icon} />}
							message={'Delete Workspace'}
							invert={true}
							onClick={
								operations.toggleDeleteWorkspaceModalIsOpen
							}
						/>
					</div>
				</div>
				<div className={styles.titleContainer}>
					<h1 className={styles.title}>Boards</h1>
					<div className={styles.inputContainer}>
						<Input
							fontSize={18}
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
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
					<BoardCard
						onClickHandler={() => {}}
						boardName="Board Name"
					/>
				</div>
			</div>
		</>
	);
};
