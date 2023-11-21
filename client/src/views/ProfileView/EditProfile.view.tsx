import { RxCross2 } from 'react-icons/rx';
import styles from './editProfile.module.css';
import { Modal } from '@/components/Modal/Modal';
import { useProfileViewModel } from './EditProfile.viewmodel';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { DeleteConfirmation } from '@/components/DeleteConfirmation/DeleteConfirmation';

interface IEditProfileView {
	closeBtnHandler(): void;
}
export const EditProfileView = ({ closeBtnHandler }: IEditProfileView) => {
	const { state, operations } = useProfileViewModel();

	return (
		<>
			{state.isDeletionModalOpen && (
				<Modal>
					<div className={styles.modalBackground}>
						<RxCross2
							className={styles.closeBtn}
							onClick={operations.toggleIsDeletionModalOpen}
						/>
						<DeleteConfirmation entityName="your profile" />
					</div>
				</Modal>
			)}

			<div className={styles.background}>
				<RxCross2
					className={styles.closeBtn}
					onClick={closeBtnHandler}
				/>
				<div className={styles.header}>
					<div className={styles.notificationMsg}>
						<p>New password saved!</p>
					</div>
				</div>
				<div className={styles.main}>
					<div className={styles.leftSide}>
						<div className={styles.imgContainer}>
							<img
								src="/imgs/profile-img.jpeg"
								alt="profile-img"
							/>
						</div>
						<h3>dimanrikalov1@abv.bg</h3>
						<IntroButton message={'Change Image'} />
						<div className={styles.formContainer}>
							<h3>Edit password</h3>
							<form className={styles.form}>
								<IntroInput
									name="password-input"
									placeholder="New password"
									type="password"
									value={state.inputValues.password}
									onChange={(e) =>
										operations.inputChangeHandler(
											e,
											'password'
										)
									}
								/>
								<IntroButton
									message={'Change Password'}
								/>
							</form>
						</div>
					</div>
					<div className={styles.rightSide}>
						<div className={styles.formContainer}>
							<h3>Edit first name</h3>
							<form className={styles.form}>
								<IntroInput
									name="first-name-input"
									placeholder="New first name"
									type="text"
									value={state.inputValues.firstName}
									onChange={(e) =>
										operations.inputChangeHandler(
											e,
											'firstName'
										)
									}
								/>
								<IntroButton
									message={'Change First Name'}

								/>
							</form>
						</div>

						<div className={styles.formContainer}>
							<h3>Edit last name</h3>
							<form className={styles.form}>
								<IntroInput
									name="last-name-input"
									placeholder="New last name"
									type="text"
									value={state.inputValues.lastName}
									onChange={(e) =>
										operations.inputChangeHandler(
											e,
											'lastName'
										)
									}
								/>
								<IntroButton
									message={'Change Last Name'}
								/>
							</form>
						</div>

						<IntroButton
							message={'Delete Profile'}

							onClick={operations.toggleIsDeletionModalOpen}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
