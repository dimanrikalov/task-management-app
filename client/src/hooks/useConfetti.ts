import { useEffect, useState } from 'react';

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
