import classNames from 'classnames';
import styles from './board.module.css';
import { LuMessageSquare } from 'react-icons/lu';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { Column } from '@/components/Column/Column';
import { useBoardViewModel } from './Board.viewmodel';
import { Message } from '@/components/Message/Message';
import { BackButton } from '@/components/BackButton/BackButton';

export const BoardView = () => {
	const { state, operations } = useBoardViewModel();

	return (
		<div className={styles.background}>
			<div
				className={classNames(
					styles.chatContainer,
					state.isChatOpen && styles.isOpen
				)}
			>
				<div
					className={classNames(
						styles.hideBtn,
						state.isChatOpen && styles.isOpen
					)}
				>
					<BackButton onClick={operations.toggleIsChatOpen} />
				</div>
				<div className={styles.header}>
					<h2>Board chat</h2>
				</div>
				<div className={styles.chat}>
					<Message isUser={false} />
					<Message isUser={true} />
					<Message isUser={false} />
					<Message isUser={true} />
					<Message isUser={true} />
				</div>
				<form className={styles.inputContainer}>
					<Input
						name="message-input"
						onChange={() => {}}
						placeholder="Write message..."
						type="text"
						value=""
					/>
					<button className={styles.sendBtn} onClick={() => {}}>
						<LuMessageSquare size={21} />
					</button>
				</form>
			</div>

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
						<BackButton onClick={() => {}} />
						<h2>Board Name</h2>
					</div>
					<div className={styles.operationsContainer}>
						<Button message="Edit" maxWidth={220} invert={true} />
						<Button message="Graph" maxWidth={220} invert={true} />
						<Button message="Delete" maxWidth={220} invert={true} />
					</div>
				</div>
				<div
					className={classNames(
						styles.columnsContainer,
						state.isChatOpen && styles.squash
					)}
				>
					<Column
						title="To Do"
						tasks={[
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},

							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},

							{
								title: 'Fix modal not opening',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Medium',
								stepsComplete: 1,
								totalSteps: 2,
							},
							{
								title: 'Animation not showing',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Low',
								taskImg: 'imgs/home-img.png',
								stepsComplete: 0,
								totalSteps: 1,
							},
						]}
					/>
					<Column
						title="To Do"
						tasks={[
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							{
								title: 'Fix modal not opening',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Medium',
								stepsComplete: 1,
								totalSteps: 2,
							},
							{
								title: 'Animation not showing',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Low',
								taskImg: 'imgs/home-img.png',
								stepsComplete: 0,
								totalSteps: 1,
							},
						]}
					/>
					<Column
						title="To Do"
						tasks={[
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							{
								title: 'Fix modal not opening',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Medium',
								stepsComplete: 1,
								totalSteps: 2,
							},
							{
								title: 'Animation not showing',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Low',
								taskImg: 'imgs/home-img.png',
								stepsComplete: 0,
								totalSteps: 1,
							},
						]}
					/>
					<Column
						title="To Do"
						tasks={[
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							{
								title: 'Fix modal not opening',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Medium',
								stepsComplete: 1,
								totalSteps: 2,
							},
							{
								title: 'Animation not showing',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Low',
								taskImg: 'imgs/home-img.png',
								stepsComplete: 0,
								totalSteps: 1,
							},
						]}
					/>
					<Column
						title="To Do"
						tasks={[
							{
								title: 'Fix Bug',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'High',
								stepsComplete: 2,
								totalSteps: 4,
							},
							{
								title: 'Fix modal not opening',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Medium',
								stepsComplete: 1,
								totalSteps: 2,
							},
							{
								title: 'Animation not showing',
								asigneeImg: '/imgs/profile-img.jpeg',
								priority: 'Low',
								taskImg: 'imgs/home-img.png',
								stepsComplete: 0,
								totalSteps: 1,
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
};
