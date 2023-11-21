import { FaUser } from "react-icons/fa";
import styles from './signUp.module.css';
import { FaUsers } from "react-icons/fa6";
import { useSignUpViewModel } from './SignUp.viewmodel';
import { BackButton } from '@/components/BackButton/BackButton';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { FaEnvelope, FaEnvelopeOpen, FaLock, FaUnlock } from 'react-icons/fa';

export const SignUpView = () => {
	const { state, operations } = useSignUpViewModel();

	return (
		<div className={styles.background}>
			<div className={styles.signInContainer}>
				<div className={styles.positionBackButton}>
					<BackButton onClick={operations.goToInitialView} />
				</div>
				<div className={styles.leftSide}>
					<div className={styles.titleContainer}>
						<h1>Taskify</h1>
						<h2>Sign Up</h2>
						{true && (
							<ErrorMessage
								message="Invalid password!"
								fontSize={16}
							/>
						)}
					</div>
					<form className={styles.form} onSubmit={operations.signUp}>
						<div className={styles.nameInputContainer}>
							<IntroInput
								name={'firstName'}
								placeholder={'Name'}
								type={'text'}
								value={state.inputFields.firstName}
								onChange={operations.handleInputChange}
								Icon={FaUser}
								ToggleIcon={FaUser}
							/>
							<IntroInput
								name={'lastName'}
								placeholder={'Surname'}
								type={'text'}
								value={state.inputFields.lastName}
								onChange={operations.handleInputChange}
								Icon={FaUsers}
								ToggleIcon={FaUsers}
							/>
						</div>
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
						<IntroButton message="Sign Up" />
					</form>
					<p className={styles.haveAnAccount}>
						Already have an account?{' '}
						<span onClick={operations.goToSignInView}>Sign in</span>
					</p>
				</div>
				<div className={styles.rightSide}>
					<img src="/imgs/sign-up-img.webp" alt="sign-up-img" />
				</div>
			</div>
		</div>
	);
};
