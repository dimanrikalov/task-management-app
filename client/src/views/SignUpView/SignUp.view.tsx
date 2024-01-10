import { FaUser } from 'react-icons/fa';
import styles from './signUp.module.css';
import { FaUsers } from 'react-icons/fa6';
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
                    <form className={styles.form} onSubmit={operations.signUp}>
                        <div className={styles.nameInputContainer}>
                            <IntroInput
                                type={'text'}
                                Icon={FaUser}
                                name={'firstName'}
                                ToggleIcon={FaUser}
                                placeholder={'Name'}
                                value={state.inputFields.firstName}
                                onChange={operations.handleInputChange}
                            />
                            <IntroInput
                                type={'text'}
                                Icon={FaUsers}
                                name={'lastName'}
                                ToggleIcon={FaUsers}
                                placeholder={'Surname'}
                                value={state.inputFields.lastName}
                                onChange={operations.handleInputChange}
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
                            Icon={FaUnlock}
                            name={'password'}
                            type={'password'}
                            ToggleIcon={FaLock}
                            placeholder={'Password'}
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
                    <img
                        alt="sign-up-img"
                        src="/imgs/sign-up-img-compressed.webp"
                    />
                </div>
            </div>
        </div>
    );
};
