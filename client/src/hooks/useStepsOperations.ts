import { useEffect, useState } from 'react';
import { useBoardContext } from '@/contexts/board.context';
import { useTaskModalContext } from '@/contexts/taskModal.context';

export interface IStep {
    isComplete: boolean;
    description: string;
}

export interface IEditStep extends IStep {
    id: number;
}

export const useStepsOperations = () => {
    const { selectedTask } = useBoardContext();
    const [progress, setProgress] = useState<number>(0);
    const { inputValues, setInputValues } = useTaskModalContext();
    const [steps, setSteps] = useState<IStep[]>(selectedTask?.steps || []);

    useEffect(() => {
        const completedCount = steps.reduce(
            (acc, x) => acc + Number(x.isComplete),
            0
        );
        setProgress(Math.round((completedCount / steps.length) * 100) || 0);
    }, [steps]);

    const addStep = () => {
        if (!inputValues.step) return;
        if (steps.some((step) => step.description === inputValues.step)) return;
        setSteps((prev) => [
            ...prev,
            { description: inputValues.step, isComplete: false }
        ]);
        setInputValues((prev) => ({ ...prev, step: '' }));
    };

    const removeStep = (description: string) => {
        setSteps((prev) => [
            ...prev.filter((step) => step.description !== description)
        ]);
    };

    const toggleStatus = (description: string) => {
        const step = steps.find((step) => step.description === description);
        if (!step) return;
        setSteps((prev) =>
            prev.map((step) => {
                if (step.description === description) {
                    return { ...step, isComplete: !step.isComplete };
                }
                return step;
            })
        );
    };

    return {
        steps,
        addStep,
        progress,
        setSteps,
        removeStep,
        toggleStatus
    };
};
