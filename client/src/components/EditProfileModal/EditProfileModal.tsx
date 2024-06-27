import classNames from 'classnames';
import { Modal } from '../Modal/Modal';
import { RxCross2 } from 'react-icons/rx';
import styles from './editProfile.module.css';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { IntroInput } from '../IntroInput/IntroInput';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';
import { languages, useTranslate } from '../../hooks/useTranslate';
import { useEditProfileModal } from '../../hooks/useEditProfileOperations';
import { DeleteConfirmation } from '../DeleteConfirmation/DeleteConfirmation';

const basePath = 'editProfile';

const translationPaths = {
	image: `${basePath}.image`,
	password: `${basePath}.password`,
	newPassword: `${basePath}.newPassword`,
	username: `${basePath}.username`,
	newUsername: `${basePath}.newUsername`,
	email: `${basePath}.email`,
	newEmail: `${basePath}.newEmail`,
	currentEmail: `${basePath}.currentEmail`,
	deleteProfile: `${basePath}.deleteProfile`,
}

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
	const { t, language } = useTranslate();
	const entityName = language === languages.bg ? 'своя профил' : 'your profile';

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
							onConfirm={deleteUser}
							entityName={entityName}
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
							<h3>{t(translationPaths.image)}</h3>
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
								<h3>{t(translationPaths.password)}</h3>
								<form
									name="password"
									className={styles.form}
									onSubmit={updateUserData}
								>
									<IntroInput
										name="password"
										type="password"
										value={inputValues.password}
										onChange={inputChangeHandler}
										placeholder={t(translationPaths.newPassword)}
									/>
									<IntroButton message={t(translationPaths.password)} />
								</form>
							</div>
						</div>
						<div className={styles.rightSide}>

							<div className={styles.formContainer}>
								<h3>{t(translationPaths.username)}</h3>
								<form
									name="username"
									className={styles.form}
									onSubmit={updateUserData}
								>
									<IntroInput
										type="text"
										name="username"
										value={inputValues.username}
										onChange={inputChangeHandler}
										placeholder={t(translationPaths.newUsername)}
									/>
									<IntroButton message={t(translationPaths.username)} />
								</form>
							</div>

							<div className={styles.formContainer}>
								<h3>{t(translationPaths.email)}</h3>
								<p className={styles.currentEmail}>
									{t(translationPaths.currentEmail)}: {userData.email}
								</p>
								<form
									name="email"
									className={styles.form}
									onSubmit={updateUserData}
								>
									<IntroInput
										type="email"
										name="email"
										value={inputValues.email}
										onChange={inputChangeHandler}
										placeholder={t(translationPaths.newEmail)}
									/>
									<IntroButton
										message={t(translationPaths.email)}
									/>
								</form>
							</div>

							<IntroButton
								onClick={toggleIsDeletionModalOpen}
								message={t(translationPaths.deleteProfile)}
							/>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};
