import {
	request,
	METHODS,
	TASK_ENDPOINTS,
	COLUMN_ENDPOINTS
} from '../utils/requester';
import { useState } from 'react';
import { useErrorContext } from '../contexts/error.context';
import { useBoardContext } from '../contexts/board.context';
import { IResult } from '../views/BoardView/Board.viewmodel';
import { IUserContextSecure, useUserContext } from '../contexts/user.context';

export const useDragEvents = () => {
	const { showError } = useErrorContext();
	const { accessToken } = useUserContext() as IUserContextSecure;
	const [hasDragStarted, setHasDragStarted] = useState<boolean>(false);
	const { boardData, setBoardData, callForConfetti } = useBoardContext();
	const toggleHasDragStarted = () => {
		setHasDragStarted((prev) => !prev);
	};

	const onDragStart = () => {
		toggleHasDragStarted();
	};

	const onDragEnd = async (result: IResult) => {
		const {
			type,
			source,
			destination,
			draggableId: rawDraggableId
		} = result;

		if (!boardData) {
			toggleHasDragStarted();
			return;
		}

		if (!destination) {
			toggleHasDragStarted();
			return;
		}

		const draggableId = rawDraggableId.split('-').pop();
		const sourceDroppableId = source.droppableId.split('-').pop();
		const destinationDroppableId = destination?.droppableId
			.split('-')
			.pop();

		if (
			destination.index === source.index &&
			sourceDroppableId === destinationDroppableId
		) {
			toggleHasDragStarted();
			return;
		}

		const startingBoardState = boardData;

		// make the api request without calling for refresh
		try {
			if (type === 'column') {
				//make optimistic update

				const selectedColumn = boardData.columns.find(
					(col) => col.id === Number(draggableId)
				)!;

				const updatedColumns = boardData.columns.map((col) => {
					if (col.id === selectedColumn.id) {
						return { ...col, position: destination.index };
					}

					if (destination.index > selectedColumn.position) {
						if (
							col.position > selectedColumn.position &&
							col.position <= destination.index
						) {
							return { ...col, position: col.position - 1 };
						}
					} else {
						if (
							col.position >= destination.index &&
							col.position < selectedColumn.position
						) {
							return { ...col, position: col.position + 1 };
						}
					}

					return col;
				});

				setBoardData((prev) => {
					if (!prev) {
						return null;
					}

					return { ...prev, columns: updatedColumns };
				});

				//make request
				const res = await request({
					accessToken,
					method: METHODS.PUT,
					endpoint: COLUMN_ENDPOINTS.MOVE,
					body: {
						columnId: Number(draggableId),
						destinationPosition: destination.index
					}
				});

				if (res.errorMessage) {
					throw new Error(res.errorMessage);
				}
			} else {
				//make optimistic update

				const srcColumn = boardData.columns.find(
					(col) => col.id === Number(sourceDroppableId)
				);
				const destColumn = boardData.columns.find(
					(col) => col.id === Number(destinationDroppableId)
				);

				if (!srcColumn || !destColumn) {
					toggleHasDragStarted();
					return;
				}

				const srcColumnTasks = [...srcColumn.tasks];

				//case where task is moved between columns
				if (srcColumn.id !== destColumn.id) {
					const destColumnTasks = [...destColumn.tasks];

					const [task] = srcColumnTasks.splice(source.index, 1);
					destColumnTasks.splice(destination.index, 0, task);

					setBoardData((prev) => {
						if (!prev) {
							return null;
						}

						const updatedColumns = prev.columns.map((col) => {
							if (col.id === Number(sourceDroppableId)) {
								return { ...col, tasks: srcColumnTasks };
							}

							if (col.id === Number(destinationDroppableId)) {
								return { ...col, tasks: destColumnTasks };
							}

							return col;
						});

						return { ...prev, columns: updatedColumns };
					});
				} else {
					//case where task is changing only its position in the same column
					if (source.index === destination.index) {
						toggleHasDragStarted();
						return;
					}

					if (destination.index >= destColumn.tasks.length) {
						destination.index = destColumn.tasks.length - 1;
					}

					const [task] = srcColumnTasks.splice(source.index, 1);
					srcColumnTasks.splice(destination.index, 0, task);

					setBoardData((prev) => {
						if (!prev) {
							return null;
						}

						const updatedColumns = prev.columns.map((col) => {
							if (col.id === srcColumn.id) {
								return {
									...col,
									tasks: srcColumnTasks
								};
							}
							return col;
						});

						return { ...prev, columns: updatedColumns };
					});
				}

				//move task
				const res = await request({
					accessToken,
					method: METHODS.PUT,
					endpoint: TASK_ENDPOINTS.MOVE,
					body: {
						taskId: Number(draggableId),
						destinationPosition: destination.index,
						destinationColumnId: Number(destinationDroppableId)
					}
				});

				if (res.errorMessage) {
					throw new Error(res.errorMessage);
				}

				if (destColumn.name === 'Done') {
					if (srcColumn.name !== 'Done') {
						callForConfetti();
					}

					setBoardData((prev) => {
						if (!prev) {
							return null;
						}

						const updatedColumns = prev.columns.map((col) => {
							const task = col.tasks.find(
								(task) => task.id === Number(draggableId)
							);
							if (task) {
								return {
									...col,
									tasks: col.tasks.map((task) => {
										if (task.id === Number(draggableId)) {
											return {
												...task,
												steps: task.steps.map(
													(step) => ({
														...step,
														isComplete: true
													})
												),
												progress: 100
											};
										}
										return { ...task };
									})
								};
							}
							return col;
						});

						return { ...prev, columns: updatedColumns };
					});
				}

				//set steps to 100%
				const data = await request({
					accessToken,
					method: METHODS.PUT,
					endpoint: TASK_ENDPOINTS.COMPLETE(Number(draggableId))
				});

				if (data.errorMessage) {
					throw new Error(data.errorMessage);
				}
			}
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
			setBoardData(startingBoardState);
		}
		toggleHasDragStarted();
	};

	return { hasDragStarted, onDragEnd, onDragStart };
};
