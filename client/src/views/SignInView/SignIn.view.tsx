import styles from './signIn.module.css';
import { FaChevronLeft } from 'react-icons/fa';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { useSignInViewmodel } from './SignIn.viewmodel';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';

export const SignInView = () => {
	const { state, operations } = useSignInViewmodel();

	return (
		<div className={styles.background}>
			<div className={styles.leftSide}>
				<img src="/imgs/sign-in-img.png" alt="sign-in-img" />
			</div>
			<div className={styles.rightSide}>
				<button
					className={styles.backBtn}
					onClick={operations.goToInitialView}
				>
					<FaChevronLeft size={16} />
				</button>
				<div className={styles.titleContainer}>
					<h1>Taskify</h1>
					<h2>Sign Up</h2>
					{true && (
						<ErrorMessage
							message="Invalid password!"
							fontSize={18}
						/>
					)}
				</div>
				<form className={styles.form} onSubmit={operations.signIn}>
					<Input
						name={'email'}
						placeholder={'Email'}
						type={'email'}
						value={state.inputFields.email}
						onChange={operations.handleInputChange}
					/>
					<Input
						name={'password'}
						placeholder={'Password'}
						type={'password'}
						value={state.inputFields.password}
						onChange={operations.handleInputChange}
					/>
					<Button message="Sign In" fontSize={18} />
				</form>
				<p className={styles.dontHaveAnAccount}>
					Already have an account?{' '}
					<span onClick={operations.goToSignUpView}>Sign Up</span>
				</p>
			</div>
		</div>
	);
};
