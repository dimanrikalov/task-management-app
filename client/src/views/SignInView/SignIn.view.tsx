import styles from './signIn.module.css';
import { FaLock } from "react-icons/fa6";
import { FaUnlock } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";
import { FaEnvelopeOpen } from "react-icons/fa";
import { useSignInViewmodel } from './SignIn.viewmodel';
import { BackButton } from '@/components/BackButton/BackButton';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';

export const SignInView = () => {
	const { state, operations } = useSignInViewmodel();

	return (
		<div className={styles.background}>
			<div className={styles.signInContainer}>
				<div className={styles.positionBackButton}>
					<BackButton onClick={operations.goToInitialView} />
				</div>
				<div className={styles.leftSide}>
					<img src="/imgs/sign-in-img.png" alt="sign-in-img" />
				</div>
				<div className={styles.rightSide}>
					<div className={styles.titleContainer}>
						<h1>Taskify</h1>
						<h2>Sign in</h2>
					</div>
					<form className={styles.form} onSubmit={operations.signIn}>
						<IntroInput
							name={'email'}
							type={'email'}
							Icon={FaEnvelopeOpen}
							placeholder={'Email'}
							ToggleIcon={FaEnvelope}
							value={state.inputFields.email}
							onChange={operations.handleInputChange}

						/>
						<IntroInput
							name={'password'}
							type={'password'}
							Icon={FaUnlock}
							placeholder={'Password'}
							ToggleIcon={FaLock}
							value={state.inputFields.password}
							onChange={operations.handleInputChange}
						/>
						<IntroButton message={'Sign in'} />
					</form>
					<p className={styles.dontHaveAnAccount}>
						Already have an account?{' '}
						<span onClick={operations.goToSignUpView}>Sign up</span>
					</p>
				</div>
			</div>
		</div>
	);
};
