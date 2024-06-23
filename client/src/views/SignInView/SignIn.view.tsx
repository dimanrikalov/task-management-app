import styles from './signIn.module.css';
import { FaLock } from 'react-icons/fa6';
import { FaUnlock } from 'react-icons/fa6';
import { MdLanguage } from 'react-icons/md';
import { FaEnvelope } from 'react-icons/fa';
import { FaEnvelopeOpen } from 'react-icons/fa';
import { useTranslate } from '@/hooks/useTranslate';
import { useSignInViewmodel } from './SignIn.viewmodel';
import { BackButton } from '../../components/BackButton/BackButton';
import { IntroInput } from '../../components/IntroInput/IntroInput';
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
	signInView: {
		dontHaveAcc: 'signInView.dontHaveAcc'
	}
}

export const SignInView = () => {
	const { t, changeLanguage } = useTranslate();
	const { state, operations } = useSignInViewmodel();

	return (
		<div className={styles.background}>
			<MdLanguage
				onClick={changeLanguage}
				className={styles.translationButton}
			/>
			<div className={styles.signInContainer}>
				<div className={styles.positionBackButton}>
					<BackButton
						style={{ borderColor: '#fff' }}
						onClick={operations.goToInitialView}
					/>
				</div>
				<div className={styles.leftSide}>
					<img alt="sign-in-img" src="./imgs/sign-in-img.png" />
				</div>
				<div className={styles.rightSide}>
					<div className={styles.titleContainer}>
						<h1>{t(translationPaths.taskify)}</h1>
						<h2>{t(translationPaths.components.buttons.signIn)}</h2>
					</div>
					<form className={styles.form} onSubmit={operations.signIn}>
						<IntroInput
							name={'email'}
							type={'email'}
							Icon={FaEnvelopeOpen}
							ToggleIcon={FaEnvelope}
							value={state.inputFields.email}
							onChange={operations.handleInputChange}
							placeholder={t(translationPaths.components.inputs.email)}
						/>
						<IntroInput
							name={'password'}
							type={'password'}
							Icon={FaUnlock}
							ToggleIcon={FaLock}
							value={state.inputFields.password}
							onChange={operations.handleInputChange}
							placeholder={t(translationPaths.components.inputs.password)}
						/>
						<IntroButton message={t(translationPaths.components.buttons.signIn)} />
					</form>
					<p className={styles.dontHaveAnAccount}>
						{t(translationPaths.signInView.dontHaveAcc)}{' '}
						<span onClick={operations.goToSignUpView} >
							{t(translationPaths.components.buttons.signUp)}
						</span>
					</p>
				</div>
			</div>
		</div >
	);
};
