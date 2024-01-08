import { IStep } from './useStepsOperations';
import { useBoardContext } from '@/contexts/board.context';
import { useErrorContext } from '@/contexts/error.context';
import { convertImageToBase64 } from '@/utils/convertImages';
import { METHODS, TASK_ENDPOINTS, request } from '@/utils/requester';
import { IUserContextSecure, useUserContext } from '@/contexts/user.context';
import { IInputState, useTaskModalContext } from '@/contexts/taskModal.context';

interface IUseTaskOperationArgs {
    steps: IStep[];
    inputValues: IInputState;
}

export const useTaskOperations = ({
    steps,
    inputValues
}: IUseTaskOperationArgs) => {
    const {
        setBoardData,
        selectedColumnId,
        toggleIsTaskModalOpen,
        selectedTask: taskData
    } = useBoardContext();
    const { showError } = useErrorContext();
    const { assigneeId } = useTaskModalContext();
    const { accessToken } = useUserContext() as IUserContextSecure;

    const createTask = async () => {
        try {
            if (!selectedColumnId) {
                throw new Error('Invalid column!');
            }

            if (!assigneeId) {
                throw new Error('Assignee is required!');
            }

            if (!inputValues.title) {
                throw new Error('Task name is required!');
            }

            if (inputValues.title.length < 2) {
                throw new Error(
                    'Task name must be at least 2 characters long!'
                );
            }

            //create the task
            const body = {
                steps,
                assigneeId,
                title: inputValues.title,
                columnId: selectedColumnId,
                description: inputValues.description,
                effort: Number(inputValues.effort) || 1,
                priority: Number(inputValues.priority) || 1,
                hoursSpent: Number(inputValues.hoursSpent) || 0,
                minutesSpent: Number(inputValues.minutesSpent) || 0,
                estimatedHours: Number(inputValues.estimatedHours) || 0,
                estimatedMinutes: Number(inputValues.estimatedMinutes) || 0
            };

            const data = await request({
                body,
                accessToken,
                method: METHODS.POST,
                endpoint: TASK_ENDPOINTS.BASE
            });

            //check for handled errors
            if (data.errorMessage) {
                throw new Error(data.errorMessage);
            }

            //set task image optionally
            if (inputValues.image) {
                const payload = new FormData();
                payload.append('taskImg', inputValues.image, 'task-img');

                const imageUploadData = await request({
                    accessToken,
                    body: payload,
                    method: METHODS.PUT,
                    endpoint: TASK_ENDPOINTS.UPLOAD_IMG(data.task.id)
                });

                if (imageUploadData.errorMessage) {
                    throw new Error(imageUploadData.errorMessage);
                }

                // Convert the image to base64
                const base64String = await convertImageToBase64(
                    inputValues.image
                );

                setBoardData((prev) => {
                    if (!prev) return null;
                    const columnToUpdate = {
                        ...prev.columns.find(
                            (col) => col.id === selectedColumnId
                        )!
                    };

                    const columns = [...prev.columns];
                    columnToUpdate.tasks.push({
                        ...data.task,
                        attachmentImgPath: base64String
                    });

                    columns.splice(columnToUpdate.position, 1, columnToUpdate);

                    return {
                        ...prev,
                        columns
                    };
                });
            } else {
                setBoardData((prev) => {
                    if (!prev) return null;
                    const columnToUpdate = {
                        ...prev.columns.find(
                            (col) => col.id === selectedColumnId
                        )!
                    };

                    columnToUpdate.tasks.push(data.task);
                    const columns = [...prev.columns];

                    columns.splice(columnToUpdate.position, 1, columnToUpdate);

                    return {
                        ...prev,
                        columns
                    };
                });
            }
            toggleIsTaskModalOpen();
        } catch (err: any) {
            console.log(err.message);
            showError(err.message);
        }
    };

    const editTask = async () => {
        if (!taskData) return;

        try {
            if (!taskData.id) {
                throw new Error('Invalid task!');
            }

            if (!assigneeId) {
                throw new Error('Assignee is required!');
            }

            if (!inputValues.title) {
                throw new Error('Task name is required!');
            }

            if (inputValues.title.length < 2) {
                throw new Error(
                    'Task name must be at least 2 characters long!'
                );
            }

            const body = {
                steps,
                assigneeId,
                title: inputValues.title,
                description: inputValues.description,
                effort: Number(inputValues.effort) || 1,
                priority: Number(inputValues.priority) || 1,
                hoursSpent: Number(inputValues.hoursSpent) || 0,
                minutesSpent: Number(inputValues.minutesSpent) || 0,
                estimatedHours: Number(inputValues.estimatedHours) || 0,
                estimatedMinutes: Number(inputValues.estimatedMinutes) || 0
            };

            const res = await request({
                accessToken,
                method: METHODS.PUT,
                body: { payload: body },
                endpoint: TASK_ENDPOINTS.EDIT(taskData.id)
            });

            if (res.errorMessage) {
                throw new Error(res.errorMessage);
            }

            //set task image optionally
            if (inputValues.image) {
                const payload = new FormData();
                payload.append('taskImg', inputValues.image, 'task-img');

                const imageUploadData = await request({
                    accessToken,
                    body: payload,
                    method: METHODS.PUT,
                    endpoint: TASK_ENDPOINTS.UPLOAD_IMG(taskData.id)
                });

                if (imageUploadData.errorMessage) {
                    throw new Error(imageUploadData.errorMessage);
                }

                const base64String = await convertImageToBase64(
                    inputValues.image
                );

                setBoardData((prev) => {
                    if (!prev) return null;

                    const columns = prev.columns.map((col) => {
                        if (col.tasks.some((task) => task.id === taskData.id)) {
                            const updatedTasks = col.tasks.map((task) =>
                                task.id === taskData.id
                                    ? {
                                          ...res.task,
                                          attachmentImgPath: base64String
                                      }
                                    : task
                            );
                            return { ...col, tasks: updatedTasks };
                        }
                        return col;
                    });

                    return { ...prev, columns };
                });
            } else {
                setBoardData((prev) => {
                    if (!prev) return null;

                    const columns = prev.columns.map((col) => {
                        if (col.tasks.some((task) => task.id === taskData.id)) {
                            const updatedTasks = col.tasks.map((task) =>
                                task.id === taskData.id ? { ...res.task } : task
                            );
                            return { ...col, tasks: updatedTasks };
                        }
                        return col;
                    });

                    return { ...prev, columns };
                });
            }
            toggleIsTaskModalOpen();
        } catch (err: any) {
            console.log(err.message);
            showError(err.message);
        }
    };

    const deleteTask = async () => {
        if (!taskData) return;

        try {
            const res = await request({
                accessToken,
                method: METHODS.DELETE,
                endpoint: TASK_ENDPOINTS.EDIT(taskData.id)
            });

            if (res.errorMessage) {
                throw new Error(res.errorMessage);
            }

            setBoardData((prev) => {
                if (!prev) return null;

                const columns = prev.columns.map((col) => {
                    if (col.tasks.some((task) => task.id === taskData.id)) {
                        const updatedTasks = col.tasks.filter(
                            (task) => task.id !== taskData.id
                        );
                        return { ...col, tasks: updatedTasks };
                    }
                    return col;
                });

                return {
                    ...prev,
                    columns
                };
            });

            toggleIsTaskModalOpen();
        } catch (err: any) {
            console.log(err.message);
            showError(err.message);
        }
    };

    return {
        editTask,
        createTask,
        deleteTask,
        toggleIsTaskModalOpen
    };
};
