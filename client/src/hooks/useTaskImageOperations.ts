import { useEffect, useState } from 'react';
import { useTaskModalContext } from '../contexts/taskModal.context';

export const useTaskImageOperations = () => {
	const { inputValues, setInputValues } = useTaskModalContext();
	const [taskImagePath, setTaskImagePath] = useState<string | null>(null);

	useEffect(() => {
		if (!inputValues.image) {
			setTaskImagePath(null);
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setTaskImagePath(reader.result as string);
		};

		reader.readAsDataURL(inputValues.image);
	}, [inputValues]);

	const changeTaskImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !e.target.files[0]) {
			return;
		}
		const selectedFile = e.target.files[0];

		setInputValues((prev) => ({
			...prev,
			image: selectedFile
		}));

		e.target.value = '';
	};

	const clearTaskImage = () => {
		setInputValues((prev) => ({ ...prev, image: null }));
		setTaskImagePath(null);
	};

	return {
		taskImagePath,
		clearTaskImage,
		changeTaskImage,
		setTaskImagePath
	};
};
