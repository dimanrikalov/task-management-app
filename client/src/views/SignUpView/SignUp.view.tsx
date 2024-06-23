import styles from './signUp.module.css';
import { MdLanguage } from 'react-icons/md';
import { FaUserTimes } from 'react-icons/fa';
import { FaUserCheck } from "react-icons/fa";
import { useTranslate } from '@/hooks/useTranslate';
import { useSignUpViewModel } from './SignUp.viewmodel';
import { BackButton } from '../../components/BackButton/BackButton';
import { IntroInput } from '../../components/IntroInput/IntroInput';
import { FaEnvelope, FaEnvelopeOpen, FaLock, FaUnlock } from 'react-icons/fa';
import { IntroButton } from '../../components/Buttons/IntroButton/IntroButton';


const translationPaths = {
	taskify: 'taskify',
	components: {
		buttons: {
			signUp: 'components.buttons.signUp',
			signIn: 'components.buttons.signIn',
		},
		inputs: {
			email: 'components.inputs.email',
			username: 'components.inputs.username',
			password: 'components.inputs.password',
		}
	},
	signUpView: {
		alreadyHaveAcc: 'signUpView.alreadyHaveAcc'
	}
}

export const SignUpView = () => {
	const { t, changeLanguage } = useTranslate();
	const { state, operations } = useSignUpViewModel();

	return (
		<div className={styles.background}>
			<MdLanguage
				onClick={changeLanguage}
				className={styles.translationButton}
			/>
			<div className={styles.signInContainer}>
				<div className={styles.positionBackButton}>
					<BackButton
						reverse={true}
						onClick={operations.goToInitialView}
					/>
				</div>
				<div className={styles.leftSide}>
					<div className={styles.titleContainer}>
						<h1>{t(translationPaths.taskify)}</h1>
						<h2>{t(translationPaths.components.buttons.signUp)}</h2>
					</div>
					<form
						className={styles.form}
						onSubmit={operations.signUp}
					>
						<IntroInput
							iconSize={20}
							name={'username'}
							type={'username'}
							Icon={FaUserTimes}
							ToggleIcon={FaUserCheck}
							value={state.inputFields.username}
							onChange={operations.handleInputChange}
							condition={state.inputFields.username.length > 1}
							placeholder={t(translationPaths.components.inputs.username)}
						/>
						<IntroInput
							name={'email'}
							type={'email'}
							Icon={FaEnvelopeOpen}
							ToggleIcon={FaEnvelope}
							value={state.inputFields.email}
							condition={!!state.inputFields.email}
							onChange={operations.handleInputChange}
							placeholder={t(translationPaths.components.inputs.email)}
						/>
						<IntroInput
							Icon={FaUnlock}
							name={'password'}
							type={'password'}
							ToggleIcon={FaLock}
							value={state.inputFields.password}
							onChange={operations.handleInputChange}
							condition={!!state.inputFields.password}
							placeholder={t(translationPaths.components.inputs.password)}
						/>
						<IntroButton message={t(translationPaths.components.buttons.signUp)} />
					</form>
					<p className={styles.haveAnAccount}>
						{t(translationPaths.signUpView.alreadyHaveAcc)}{' '}
						<span onClick={operations.goToSignInView}>
							{t(translationPaths.components.buttons.signIn)}
						</span>
					</p>
				</div>
				<div className={styles.rightSide}>
					<img
						alt="sign-up-img"
						src="./imgs/sign-up-img-compressed.webp"
					/>
				</div>
			</div>
		</div>
	);
};
