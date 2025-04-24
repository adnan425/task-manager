import TaskForm from "@/components/tasks/TaskForm";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTasksList } from '@/hooks/useTasks';
const TableHeader = () => {
    const { statusFilter, priorityFilter, setPriorityFilter, setStatusFilter, } = useTasksList()
    return (
        <div className="flex flex-wrap items-center gap-3 py-4">

            <Select
                value={statusFilter}
                onValueChange={(value) => {
                    setStatusFilter(value);
                }}
            >
                <SelectTrigger className=" ">
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select
                value={priorityFilter}
                onValueChange={(value) => {
                    setPriorityFilter(value);
                }}
            >
                <SelectTrigger className="">
                    <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>


            <div className="ml-auto">
                <TaskForm />
            </div>
        </div>
    )
}

export default TableHeader