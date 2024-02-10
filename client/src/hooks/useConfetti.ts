import { useEffect, useState } from 'react';

export const colors = [
	'#FFD700',
	'#C0C0C0',
	'#B76E79',
	'#87CEEB',
	'#98FF98',
	'#E6E6FA',
	'#FFDAB9',
	'#FF6F61',
	'#FFB6C1',
	'#C8A2C8'
];

export const useConfetti = () => {
	const [shouldConfettiExplode, setShouldConfettiExplode] = useState(false);

	useEffect(() => {
		if (!shouldConfettiExplode) return;
		const timeout = setTimeout(() => {
			setShouldConfettiExplode(false);
		}, 1500);

		return () => clearTimeout(timeout);
	}, [shouldConfettiExplode]);

	const callForConfetti = () => {
		setShouldConfettiExplode(true);
	};

	return {
		shouldConfettiExplode,
		callForConfetti
	};
};
