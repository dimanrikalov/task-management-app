import {
    request,
    METHODS,
    BOARD_ENDPOINTS,
    COLUMN_ENDPOINTS
} from '@/utils/requester';
import { useNavigate } from 'react-router-dom';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useBoardContext } from '@/contexts/board.context';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

const defaultNewColumnName = import.meta.env.VITE_DEFAULT_COLUMN_NAME as string;

export const useEditBoard = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { boardData, setBoardData } = useBoardContext();
    const { accessToken } = useAppSelector((state) => state.user);

    const addColumn = async () => {
        if (!boardData) return;
        try {
            const isColumnWithDefaultNamePresent = boardData?.columns.some(
                (col) => col.name === defaultNewColumnName
            );
            if (isColumnWithDefaultNamePresent) {
                throw new Error(
                    'Please name the previously created column first!'
                );
            }

            const res = await request({
                body: {
                    boardId: boardData.id,
                    name: defaultNewColumnName
                },
                accessToken,
                method: METHODS.POST,
                endpoint: COLUMN_ENDPOINTS.BASE
            });

            if (res.errorMessage) {
                throw new Error(res.errorMessage);
            }

            setBoardData((prev) => {
                if (!prev) return null;

                const columns = [
                    ...prev.columns,
                    {
                        tasks: [],
                        id: res.columnId,
                        boardId: prev.id,
                        name: defaultNewColumnName,
                        position: prev.columns.length
                    }
                ];

                return {
                    ...prev,
                    columns
                };
            });
        } catch (err: any) {
            console.log(err.message);
            dispatch(setErrorMessageAsync(err.message));
        }
    };

    const updateColumnData = (columnId: number, columnName: string) => {
        setBoardData((prev) => {
            if (!prev) return null;

            const columns = prev.columns.map((col) => {
                if (col.id === columnId) {
                    col.name = columnName;
                }

                return col;
            });

            return { ...prev, columns: [...columns] };
        });
    };

    const deleteBoard = async () => {
        if (!boardData) return;
        try {
            await request({
                accessToken,
                method: METHODS.DELETE,
                endpoint: BOARD_ENDPOINTS.BOARD(boardData.id)
            });
            navigate(-1);
        } catch (err: any) {
            console.log(err.message);
            dispatch(setErrorMessageAsync(err.message));
        }
    };

    return {
        addColumn,
        deleteBoard,
        updateColumnData
    };
};
