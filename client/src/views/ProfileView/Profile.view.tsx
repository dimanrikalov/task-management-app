import { RxCross2 } from 'react-icons/rx';
import styles from './profile.module.css';
import { Modal } from '@/components/Modal/Modal';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { useProfileViewModel } from './Profile.viewmodel';
import { BackButton } from '@/components/BackButton/BackButton';
import { DeleteConfirmation } from '@/components/DeleteConfirmation/DeleteConfirmation';

export const ProfileView = () => {
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
				<div className={styles.header}>
					<BackButton onClick={operations.goBack} />
					<div className={styles.notificationMsg}>
						<p>New password saved!</p>
					</div>
				</div>
				<div className={styles.main}>
					<div className={styles.leftSide}>
						<h3>dimanrikalov1@abv.bg</h3>
						<div className={styles.imgContainer}>
							<img
								src="/imgs/profile-img.jpeg"
								alt="profile-img"
							/>
						</div>
						<Button message={'Change Image'} invert={true} />
						<div className={styles.formContainer}>
							<h3>Edit password</h3>
							<form className={styles.form}>
								<Input
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
								<Button
									message={'Change Password'}
									invert={true}
								/>
							</form>
						</div>
					</div>
					<div className={styles.rightSide}>
						<div className={styles.formContainer}>
							<h3>Edit first name</h3>
							<form className={styles.form}>
								<Input
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
								<Button
									message={'Change First Name'}
									invert={true}
								/>
							</form>
						</div>

						<div className={styles.formContainer}>
							<h3>Edit last name</h3>
							<form className={styles.form}>
								<Input
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
								<Button
									message={'Change Last Name'}
									invert={true}
								/>
							</form>
						</div>

						<Button
							message={'Delete Profile'}
							invert={true}
							onClick={operations.toggleIsDeletionModalOpen}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
