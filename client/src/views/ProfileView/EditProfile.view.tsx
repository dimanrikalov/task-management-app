import classNames from 'classnames';
import { RxCross2 } from 'react-icons/rx';
import styles from './editProfile.module.css';
import { Modal } from '@/components/Modal/Modal';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { useProfileViewModel } from './EditProfile.viewmodel';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { DeleteConfirmation } from '@/components/DeleteConfirmation/DeleteConfirmation';

export const EditProfileView = () => {
	const { state, operations } = useProfileViewModel();

	return (
		<Modal>
			{state.isDeletionModalOpen && (
				<Modal>
					<div className={styles.modalBackground}>
						<RxCross2
							className={styles.closeBtn}
							onClick={operations.toggleIsDeletionModalOpen}
						/>
						<DeleteConfirmation
							entityName="your profile"
							onConfirm={operations.deleteUser}
							onCancel={operations.toggleIsDeletionModalOpen}
						/>
					</div>
				</Modal>
			)}

			<div className={styles.backgroundWrapper}>
				<div className={styles.background}>
					<RxCross2
						className={styles.closeBtn}
						onClick={operations.toggleIsEditProfileModalOpen}
					/>
					{/* adds some spacing on the top side */}
					<div className={styles.header}></div>
					<div className={styles.main}>
						<div className={styles.leftSide}>
							<h3>Edit profile image</h3>
							<label
								className={styles.imgInput}
								htmlFor={'imgInput'}
							>
								<div className={styles.imgContainer}>
									<img
										alt="profile-img"
										className={styles.previewImage}
										src={state.profileImgPath || state.userData.profileImagePath}
									/>
								</div>
							</label>
							<form name='profileImg'
								onSubmit={operations.updateUserData}
								onReset={operations.clearProfileImg}
							>
								<input
									type="file"
									id="imgInput"
									className={styles.fileInput}
									onChange={operations.changeProfileImage}
									disabled={!!state.inputValues.profileImg}
									accept="image/png, image/jpg, image/gif, image/jpeg"
								/>
								<div className={styles.imgOperationsContainer}>
									<button
										type='submit'
										className={styles.imgBtn}
										disabled={!state.inputValues.profileImg}
									>
										<FaCheck
											className={classNames(
												styles.submitBtn,
												styles.imgOperationBtn,
												!state.inputValues.profileImg && styles.disabled
											)}
										/>
									</button>
									<button
										type='reset'
										className={styles.imgBtn}
										disabled={!state.inputValues.profileImg}
									>
										<FaXmark
											className={classNames(
												styles.resetBtn,
												styles.imgOperationBtn,
												!state.inputValues.profileImg && styles.disabled
											)}
										/>
									</button>
								</div>
							</form>

							<div className={styles.formContainer}>
								<h3>Edit password</h3>
								<form
									name='password'
									className={styles.form}
									onSubmit={operations.updateUserData}
								>
									<IntroInput
										name="password"
										type="password"
										placeholder="New password"
										value={state.inputValues.password}
										onChange={operations.inputChangeHandler}
									/>
									<IntroButton message={'Change Password'} />
								</form>
							</div>
						</div>
						<div className={styles.rightSide}>
							<div className={styles.formContainer}>
								<h3>Edit first name</h3>
								<form
									name='firstName'
									className={styles.form}
									onSubmit={operations.updateUserData}
								>
									<IntroInput
										type="text"
										name="firstName"
										placeholder="New first name"
										value={state.inputValues.firstName}
										onChange={operations.inputChangeHandler}
									/>
									<IntroButton
										message={'Change First Name'}
									/>
								</form>
							</div>

							<div className={styles.formContainer}>
								<h3>Edit last name</h3>
								<form
									name='lastName'
									className={styles.form}
									onSubmit={operations.updateUserData}
								>
									<IntroInput
										type="text"
										name="lastName"
										placeholder="New last name"
										value={state.inputValues.lastName}
										onChange={operations.inputChangeHandler}
									/>
									<IntroButton message={'Change Last Name'} />
								</form>
							</div>

							<IntroButton
								message={'Delete Profile'}
								onClick={operations.toggleIsDeletionModalOpen}
							/>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};
