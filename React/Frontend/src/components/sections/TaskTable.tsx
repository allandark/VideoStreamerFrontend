import { useEffect, useState } from "react";
import type { TaskModel } from "../../Types";
import { APIClient } from "../../api/api";
import { CreatedAt } from "../elements/CreatedAt";

interface TaskTableProps{
    uiState : string | undefined;
    onRowClicked : (task: TaskModel) => void;
}

export default function TaskTable({uiState, onRowClicked} : TaskTableProps){
    const [tasks, setTasks] = useState<TaskModel[]>([])

    useEffect(() => {
        const client = new APIClient();
        client.get<TaskModel>("media/task").then(data =>{
            setTasks(data);
        }).catch((err)=> console.error(err))


    }, [uiState]);

    return (
        <div className="">
            <h2 className="my-3 text-center text-3xl">Task list</h2>
            <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800">
                    <tr>
                        <th className="px-4 py-2 text-left text-gray-300 font-semibold">ID</th>
                        <th className="px-4 py-2 text-left text-gray-300 font-semibold">Media ID</th>
                        <th className="px-4 py-2 text-left text-gray-300 font-semibold">Type</th>
                        <th className="px-4 py-2 text-left text-gray-300 font-semibold">Status</th>
                        <th className="px-4 py-2 text-left text-gray-300 font-semibold">Error Message</th>
                        <th className="px-4 py-2 text-left text-gray-300 font-semibold">Creation Data</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tasks.map((value, i) => (
                            <tr key={i} data-id={value.id} onClick={() => onRowClicked(value)} className="border-t border-gray-700 hover:bg-gray-500">
                                <th className="px-4 py-2 text-left text-gray-300 font-semibold">{value.id}</th> 
                                <th className="px-4 py-2 text-left text-gray-300 font-semibold">{value.media_id}</th> 
                                <th className="px-4 py-2 text-left text-gray-300 font-semibold">{value.task_type}</th> 
                                <th className="px-4 py-2 text-left text-gray-300 font-semibold">{value.status}</th> 
                                <th className="px-4 py-2 text-left text-gray-300 font-semibold">{value.error_message}</th> 
                                <th className="px-4 py-2 text-left text-gray-300 font-semibold"><CreatedAt value={value.creation_date} /></th> 
                            </tr>
                        ))
                        
                    }

                </tbody>
            </table>
        </div>
    );
}
