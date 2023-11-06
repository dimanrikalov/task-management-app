import styles from './intro.module.css';
import { Button } from '@/components/Button/Button';
import { useIntroViewModel } from './intro.viewmodel';

export const IntroView = () => {
	const { operations } = useIntroViewModel();
	return (
		<div className={styles.background}>
			<div className={styles.leftSide}>
				<h1 className={styles.title}>Taskify</h1>
				<p className={styles.p1}>
					Taskify lets you work <span>more</span> collaboratively and
					get <span>more</span> done.
				</p>
				<p className={styles.p2}>
					Taskify's <span>workspaces</span>, <span>boards</span>,{' '}
					<span>messages</span>, <span>columns</span> and{' '}
					<span>tasks</span> enable you to organize and prioritize
					your assignments in a clear, cohesive and rewarding way.
				</p>
				<div className={styles.buttonDiv}>
					<Button
						fontSize={18}
						onClick={operations.signInHandler}
						message="Sign In"
					/>
					<p>or</p>
					<Button
						fontSize={18}
						onClick={operations.signUpHandler}
						message="Sign Up"
					/>
				</div>
			</div>
			<div className={styles.rightSide}>
				<img
					className={styles.img}
					src="/imgs/intro-img.webp"
					alt="greeting-img"
				/>
			</div>
		</div>
	);
};
