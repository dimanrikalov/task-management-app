import classNames from 'classnames';
import { Modal } from '../Modal/Modal';
import { RxCross2 } from 'react-icons/rx';
import styles from './editProfile.module.css';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { IntroInput } from '../IntroInput/IntroInput';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';
import { useEditProfileModal } from '../../hooks/useEditProfileOperations';
import { DeleteConfirmation } from '../DeleteConfirmation/DeleteConfirmation';

export const EditProfileModal = () => {
	const {
		userData,
		deleteUser,
		inputValues,
		updateUserData,
		profileImgPath,
		clearProfileImg,
		inputChangeHandler,
		changeProfileImage,
		isDeletionModalOpen,
		toggleIsDeletionModalOpen,
		toggleIsEditProfileModalOpen
	} = useEditProfileModal();

	return (
		<Modal>
			{isDeletionModalOpen && (
				<Modal>
					<div className={styles.modalBackground}>
						<RxCross2
							className={styles.closeBtn}
							onClick={toggleIsDeletionModalOpen}
						/>
						<DeleteConfirmation
							entityName="your profile"
							onConfirm={deleteUser}
							onCancel={toggleIsDeletionModalOpen}
						/>
					</div>
				</Modal>
			)}

			<div className={styles.backgroundWrapper}>
				<div className={styles.background}>
					<RxCross2
						className={styles.closeBtn}
						onClick={toggleIsEditProfileModalOpen}
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
										src={
											profileImgPath ||
											userData.profileImagePath
										}
									/>
								</div>
							</label>
							<form
								name="profileImg"
								onSubmit={updateUserData}
								onReset={clearProfileImg}
							>
								<input
									type="file"
									id="imgInput"
									className={styles.fileInput}
									onChange={changeProfileImage}
									disabled={!!inputValues.profileImg}
									accept="image/png, image/jpg, image/gif, image/jpeg"
								/>
								<div className={styles.imgOperationsContainer}>
									<button
										type="submit"
										className={styles.imgBtn}
										disabled={!inputValues.profileImg}
									>
										<FaCheck
											className={classNames(
												styles.submitBtn,
												styles.imgOperationBtn,
												!inputValues.profileImg &&
													styles.disabled
											)}
										/>
									</button>
									<button
										type="reset"
										className={styles.imgBtn}
										disabled={!inputValues.profileImg}
									>
										<FaXmark
											className={classNames(
												styles.resetBtn,
												styles.imgOperationBtn,
												!inputValues.profileImg &&
													styles.disabled
											)}
										/>
									</button>
								</div>
							</form>

							<div className={styles.formContainer}>
								<h3>Edit password</h3>
								<form
									name="password"
									className={styles.form}
									onSubmit={updateUserData}
								>
									<IntroInput
										name="password"
										type="password"
										placeholder="New password"
										value={inputValues.password}
										onChange={inputChangeHandler}
									/>
									<IntroButton message={'Change Password'} />
								</form>
							</div>
						</div>
						<div className={styles.rightSide}>
							<div className={styles.formContainer}>
								<h3>Edit first name</h3>
								<form
									name="firstName"
									className={styles.form}
									onSubmit={updateUserData}
								>
									<IntroInput
										type="text"
										name="firstName"
										placeholder="New first name"
										value={inputValues.firstName}
										onChange={inputChangeHandler}
									/>
									<IntroButton
										message={'Change First Name'}
									/>
								</form>
							</div>

							<div className={styles.formContainer}>
								<h3>Edit last name</h3>
								<form
									name="lastName"
									className={styles.form}
									onSubmit={updateUserData}
								>
									<IntroInput
										type="text"
										name="lastName"
										placeholder="New last name"
										value={inputValues.lastName}
										onChange={inputChangeHandler}
									/>
									<IntroButton message={'Change Last Name'} />
								</form>
							</div>

							<IntroButton
								message={'Delete Profile'}
								onClick={toggleIsDeletionModalOpen}
							/>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};
