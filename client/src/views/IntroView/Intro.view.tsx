import styles from './intro.module.css';
import { MdLanguage } from "react-icons/md";
import { useIntroViewModel } from './intro.viewmodel';
import { useTranslate } from '../../hooks/useTranslate';
import { IntroButton } from '../../components/Buttons/IntroButton/IntroButton';

const translationPaths = {
	taskify: 'taskify',
	components: {
		buttons: {
			signUp: 'components.buttons.signUp',
			signIn: 'components.buttons.signIn',
		}
	},
	introView: {
		or: 'introView.or',
		subtitle: 'introView.subtitle',
		description: 'introView.description',
	}
}

export const IntroView = () => {
	const { t, changeLanguage } = useTranslate();
	const { operations } = useIntroViewModel();

	return (
		<div className={styles.background}>
			<MdLanguage
				onClick={changeLanguage}
				className={styles.translationButton}
			/>
			<div className={styles.leftSide}>
				<h1 className={styles.title}>{t(translationPaths.taskify)}</h1>
				<p className={styles.p1}>
					{t(translationPaths.introView.subtitle)}
				</p>
				<p className={styles.p2}>
					{t(translationPaths.introView.description)}
				</p>
				<div className={styles.buttonDiv}>
					<IntroButton
						message={t(translationPaths.components.buttons.signIn)}
						onClick={operations.signInHandler}
					/>
					<p>{t(translationPaths.introView.or)}</p>
					<IntroButton
						message={t(translationPaths.components.buttons.signUp)}
						onClick={operations.signUpHandler}
					/>
				</div>
			</div>
			<div className={styles.rightSide}>
				<img
					alt="greeting-img"
					className={styles.img}
					src="./imgs/intro-img-compressed.webp"
				/>
			</div>
		</div>
	);
};
