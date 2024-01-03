import {
	request,
	METHODS,
	TASK_ENDPOINTS,
	COLUMN_ENDPOINTS,
} from '@/utils/requester';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useBoardContext } from '@/contexts/board.context';
import { IResult } from '@/views/BoardView/Board.viewmodel';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

export const useOnDragEnd = () => {
	const dispatch = useAppDispatch();
	const { boardData, setBoardData } = useBoardContext();
	const { accessToken } = useAppSelector((state) => state.user);

	const onDragEnd = async (result: IResult) => {
		const {
			type,
			source,
			destination,
			draggableId: rawDraggableId,
		} = result;

		if (!boardData) {
			return;
		}

		if (!destination) {
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
						destinationPosition: destination.index,
					},
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
									tasks: srcColumnTasks,
								};
							}
							return col;
						});

						return { ...prev, columns: updatedColumns };
					});
				}

				//make request
				const res = await request({
					accessToken,
					method: METHODS.PUT,
					endpoint: TASK_ENDPOINTS.MOVE,
					body: {
						taskId: Number(draggableId),
						destinationPosition: destination.index,
						destinationColumnId: Number(destinationDroppableId),
					},
				});

				if (res.errorMessage) {
					throw new Error(res.errorMessage);
				}
			}
		} catch (err: any) {
			console.log(err.message);
			dispatch(setErrorMessageAsync(err.message));
			setBoardData(startingBoardState);
		}
	};

	return { onDragEnd };
};
