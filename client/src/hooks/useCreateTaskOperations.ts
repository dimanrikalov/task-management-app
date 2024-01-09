import {
    IStep,
    IEditStep,
    useStepsOperations
} from '@/hooks/useStepsOperations';
import { useState, useEffect } from 'react';
import { ITask } from '@/components/Task/Task';
import { useErrorContext } from '@/contexts/error.context';
import { useBoardContext } from '@/contexts/board.context';
import { useTaskOperations } from '@/hooks/useTaskOperations';
import { generateFileFromBase64 } from '@/utils/convertImages';
import { ViewModelReturnType } from '@/interfaces/viewModel.interface';
import { useTaskImageOperations } from '@/hooks/useTaskImageOperations';
import { IUser } from '@/components/AddColleagueInput/AddColleagueInput';
import { useTaskAssigneeOperations } from '@/hooks/useTaskAssigneeOperations';
import { IInputState, useTaskModalContext } from '@/contexts/taskModal.context';

interface ICreateTaskOperationsState {
    steps: IStep[];
    matches: IUser[];
    progress: number;
    inputValues: IInputState;
    assigneeId: number | null;
    selectedTask: ITask | null;
    showConfirmButton: boolean;
    taskImagePath: string | null;
}

interface ICreateTaskOperations {
    addStep(): void;
    clearTaskImage(): void;
    editTask(): Promise<void>;
    deleteTask(): Promise<void>;
    createTask(): Promise<void>;
    toggleConfirmationBtn(): void;
    loadTaskData(task: ITask): void;
    showError(message: string): void;
    selectAssignee(user: IUser): void;
    removeStep(description: string): void;
    toggleStatus(description: string): void;
    changeTaskImage(e: React.ChangeEvent<HTMLInputElement>): void;
    handleInputChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ): void;
}

export const useCreateTaskOperations = (): ViewModelReturnType<
    ICreateTaskOperationsState,
    ICreateTaskOperations
> => {
    const {
        matches,
        assigneeId,
        inputValues,
        setInputValues,
        handleInputChange
    } = useTaskModalContext();
    const { showError } = useErrorContext();
    const { steps, setSteps, addStep, removeStep, progress, toggleStatus } =
        useStepsOperations();
    const { selectAssignee } = useTaskAssigneeOperations();
    const { workspaceUsers, selectedTask } = useBoardContext();
    const { editTask, createTask, deleteTask } = useTaskOperations({
        inputValues,
        steps
    });
    const [showConfirmButton, setShowConfirmButton] = useState<boolean>(false);
    const { taskImagePath, clearTaskImage, changeTaskImage, setTaskImagePath } =
        useTaskImageOperations();

    useEffect(() => {
        if (!selectedTask) return;
        loadTaskData(selectedTask);
    }, []);

    const toggleConfirmationBtn = () => {
        setShowConfirmButton((prev) => !prev);
    };

    const loadTaskData = (task: ITask) => {
        if (!task) return;

        // Sort task.steps by id
        const sortedSteps = task.steps
            ? [...(task.steps as IEditStep[])].sort((a, b) => a.id - b.id)
            : [];

        Object.entries(task).forEach(([key, value]) => {
            setInputValues((prev) => ({
                ...prev,
                [key]: value
            }));
        });

        const image = generateFileFromBase64(
            task.attachmentImgPath,
            'image/png',
            'task-img'
        );

        setInputValues((prev) => ({
            ...prev,
            image,
            email:
                workspaceUsers.find((user) => user.id === task.assigneeId)
                    ?.email || ''
        }));

        // Set the sorted steps
        setSteps(sortedSteps);

        if (task.attachmentImgPath) {
            setTaskImagePath(`data:image/png;base64,${task.attachmentImgPath}`);
        } else {
            setTaskImagePath(null);
            setInputValues((prev) => ({ ...prev, image: null }));
        }
    };

    return {
        state: {
            steps,
            matches,
            progress,
            assigneeId,
            inputValues,
            selectedTask,
            taskImagePath,
            showConfirmButton
        },
        operations: {
            addStep,
            editTask,
            showError,
            removeStep,
            deleteTask,
            createTask,
            loadTaskData,
            toggleStatus,
            selectAssignee,
            clearTaskImage,
            changeTaskImage,
            handleInputChange,
            toggleConfirmationBtn
        }
    };
};