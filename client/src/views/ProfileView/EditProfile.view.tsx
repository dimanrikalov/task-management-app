import { RxCross2 } from 'react-icons/rx';
import styles from './editProfile.module.css';
import { Modal } from '@/components/Modal/Modal';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { useProfileViewModel } from './EditProfile.viewmodel';
import { IntroInput } from '@/components/Inputs/IntroInput/IntroInput';
import { IntroButton } from '@/components/Buttons/IntroButton/IntroButton';
import { DeleteConfirmation } from '@/components/DeleteConfirmation/DeleteConfirmation';
import classNames from 'classnames';
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

			<div className={styles.backgroundWrapper}>
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
							<h3>Edit profile image</h3>
							<label
								className={styles.imgInput}
								htmlFor={'imgInput'}
							>
								<div className={styles.imgContainer}>
									{state.profileImgPath ? (
										<img
											src={state.profileImgPath}
											alt="profile-img"
											className={styles.previewImage}
										/>
									) : (
										<img
											src="/imgs/profile-img.jpeg"
											alt="default-profile-img"
											className={styles.defaultImage}
										/>
									)}
								</div>
							</label>
							<input
								id="imgInput"
								type="file"
								className={styles.fileInput}
								onChange={operations.handleProfileImgChange}
								accept="image/png, image/jpg, image/gif, image/jpeg"
							/>
							<div className={styles.imgOperationsContainer}>
								<FaCheck
									disabled={!state.profileImg}
									className={classNames(
										styles.imgOperationBtn,
										!state.profileImg && styles.disabled
									)}
									onClick={operations.handleProfileImgUpload}
								/>
								<FaXmark
									disabled={!state.profileImg}
									className={classNames(
										styles.imgOperationBtn,
										!state.profileImg && styles.disabled
									)}
									onClick={operations.clearProfileImg}
								/>
							</div>

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
									<IntroButton message={'Change Password'} />
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
		</>
	);
};
