import { useBoardContext } from "./board.context";
import { generateFileFromBase64 } from "@/utils/convertImages";
import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/components/AddColleagueInput/AddColleagueInput";

export interface IInputState {
    title: string;
    step: string;
    email: string;
    effort: string;
    priority: string;
    image: File | null;
    hoursSpent: string;
    description: string;
    minutesSpent: string;
    estimatedHours: string;
    estimatedMinutes: string;
}

interface ITaskModalContext {
    matches: IUser[];
    inputValues: IInputState;
    assigneeId: number | null;
    setMatches: React.Dispatch<React.SetStateAction<IUser[]>>;
    handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
    setInputValues: React.Dispatch<React.SetStateAction<IInputState>>;
    setAssigneeId: React.Dispatch<React.SetStateAction<number | null>>;
}

const TaskModalContext = createContext<any>(null);

export const useTaskModalContext = () => useContext<ITaskModalContext>(TaskModalContext);

export const TaskModalContextProvider:
    React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const { selectedTask } = useBoardContext();
        const [assigneeId, setAssigneeId] = useState<number | null>(null);
        const [inputValues, setInputValues] = useState<IInputState>({
            step: '',
            title: '',
            email: '',
            effort: '',
            image: null,
            priority: '',
            hoursSpent: '',
            description: '',
            minutesSpent: '',
            estimatedHours: '',
            estimatedMinutes: '',
        });

        const { workspaceUsers } = useBoardContext();
        const [matches, setMatches] = useState<IUser[]>(workspaceUsers);

        useEffect(() => {
            if (!selectedTask) return;
            const email = workspaceUsers.
                find(user => user.id === selectedTask.assigneeId)?.email || ''
            const image = selectedTask.attachmentImgPath ?
                generateFileFromBase64(selectedTask.attachmentImgPath,
                    'image/png',
                    'task-img'
                ) : null
            setInputValues({
                email,
                image,
                step: '',
                title: selectedTask.title,
                description: selectedTask.description,
                effort: selectedTask.effort.toString(),
                priority: selectedTask.priority.toString(),
                hoursSpent: selectedTask.hoursSpent.toString(),
                minutesSpent: selectedTask.minutesSpent.toString(),
                estimatedHours: selectedTask.estimatedHours.toString(),
                estimatedMinutes: selectedTask.estimatedMinutes.toString(),
            })
        }, [selectedTask]);


        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValues((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
        };

        const data: ITaskModalContext = {
            matches,
            assigneeId,
            setMatches,
            inputValues,
            setAssigneeId,
            setInputValues,
            handleInputChange,
        }
        return (
            <TaskModalContext.Provider value={data}>
                {children}
            </TaskModalContext.Provider>
        );
    }