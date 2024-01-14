import styles from './signUp.module.css';
import { FaUserTimes } from 'react-icons/fa';
import { FaUserCheck } from "react-icons/fa";
import { useSignUpViewModel } from './SignUp.viewmodel';
import { BackButton } from '../../components/BackButton/BackButton';
import { IntroInput } from '../../components/IntroInput/IntroInput';
import { FaEnvelope, FaEnvelopeOpen, FaLock, FaUnlock } from 'react-icons/fa';
import { IntroButton } from '../../components/Buttons/IntroButton/IntroButton';

export const SignUpView = () => {
	const { state, operations } = useSignUpViewModel();

	return (
		<div className={styles.background}>
			<div className={styles.signInContainer}>
				<div className={styles.positionBackButton}>
					<BackButton
						reverse={true}
						onClick={operations.goToInitialView}
					/>
				</div>
				<div className={styles.leftSide}>
					<div className={styles.titleContainer}>
						<h1>Taskify</h1>
						<h2>Sign up</h2>
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
							placeholder={'Username'}
							value={state.inputFields.username}
							onChange={operations.handleInputChange}
							condition={state.inputFields.username.length > 1}
						/>
						<IntroInput
							name={'email'}
							type={'email'}
							Icon={FaEnvelopeOpen}
							placeholder={'Email'}
							ToggleIcon={FaEnvelope}
							value={state.inputFields.email}
							condition={!!state.inputFields.email}
							onChange={operations.handleInputChange}
						/>
						<IntroInput
							Icon={FaUnlock}
							name={'password'}
							type={'password'}
							ToggleIcon={FaLock}
							placeholder={'Password'}
							value={state.inputFields.password}
							onChange={operations.handleInputChange}
							condition={!!state.inputFields.password}
						/>
						<IntroButton message="Sign Up" />
					</form>
					<p className={styles.haveAnAccount}>
						Already have an account?{' '}
						<span onClick={operations.goToSignInView}>Sign in</span>
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
