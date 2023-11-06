import styles from './signUp.module.css';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { useSignUpViewModel } from './SignUp.viewmodel';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMEssage';

export const SignUpView = () => {
	const { state, operations } = useSignUpViewModel();

	return (
		<div className={styles.background}>
			<div className={styles.leftSide}>
				<div className={styles.titleContainer}>
					<h1>Taskify</h1>
					<h2>Sign Up</h2>
					<ErrorMessage message="Invalid password!" fontSize={18} />
				</div>
				<form className={styles.form}>
					<Input
						name={'firstName'}
						placeholder={'First Name'}
						type={'text'}
						value={state.inputFields.firstName}
						onChange={operations.handleInputChange}
					/>
					<Input
						name={'lastName'}
						placeholder={'Last Name'}
						type={'text'}
						value={state.inputFields.lastName}
						onChange={operations.handleInputChange}
					/>
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
					<Button
						message="Sign Up"
						onClick={operations.signUp}
						fontSize={18}
					/>
				</form>
				<p className={styles.haveAnAccount}>
					Already have an account?{' '}
					<span onClick={operations.goToSignInView}>Sign In</span>
				</p>
			</div>
			<div className={styles.rightSide}>
                <img src="/imgs/sign-up-img.png" alt="sign-up-img" />
            </div>
		</div>
	);
};
