
import type { TaskHandle } from "../../Types";
import { CreatedAt } from "../elements/CreatedAt";



interface TaskCardProps {
  handle: TaskHandle|undefined;
}

export default function TaskStatus({handle} : TaskCardProps){
  if(handle?.task && handle.task != null){
    return (
    
    <div className="bg-gray-800 w-full h-105 rounded-lg overflow-hidden shadow-md p-4 text-gray-200 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-blue-400">
          Task #{handle.task.id}
        </h3>
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            handle.task.status === "done"
              ? "bg-green-600 text-white"
              : handle.task.status === "error"
              ? "bg-red-600 text-white"
              : "bg-yellow-500 text-black"
          }`}
        >
          {handle.task.status?.toUpperCase() ?? ""}
        </span>
      </div>

      {/* Details */}
      <ul className="space-y-1 text-sm">
        <li>
          <span className="font-medium text-gray-400">Media ID:</span>{" "}
          {handle.task.media_id}
        </li>
        <li>
          <span className="font-medium text-gray-400">Type:</span>{" "}
          {handle.task.task_type}
        </li>
        <li>
          <span className="font-medium text-gray-400">Created:</span>{" "}
          <CreatedAt value={handle.task.creation_date} />
        </li>
        {handle.task.error_message && (
          <li className="text-red-400">
            <span className="font-medium">Error:</span> {handle.task.error_message}
          </li>
        )}
      </ul>

      {/* Params */}
      <div className="mt-3">
        <span className="font-medium text-gray-400">Params:</span>
        <div className="max-h-60 overflow-auto bg-gray-900 rounded p-2 mt-1"> 
          <pre className="text-xs m-0">
            {JSON.stringify(handle.task.params, null, 2)}
          </pre>
        </div>
      </div>
    </div>    
    );
    }
    else{
        return (
            <div className="bg-gray-800 w-full rounded-lg  shadow-md p-4 text-gray-200 hover:shadow-lg transition">No Active task</div>
        );
    }
};
