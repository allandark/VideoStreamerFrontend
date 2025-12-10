import Layout from "../components/Layout";
import CreateTaskForm from "../components/forms/CreateTaskForm";
import FileBrowser from "../components/sections/FileBrowser";
import TaskStatus from "../components/sections/TaskStatus";
import TaskTable from "../components/sections/TaskTable";
import { useState, useEffect } from "react";
import type { TaskHandle } from "../Types";
import { createInitialHandle } from "../Types";
import { startUploadTask,  updateUploadTask, completeUploadTask} from "../api/Task";
import { startHlsBuildTask, updateHlsBuildTask, completeHlsBuildTask } from "../api/Task";


export default function Admin() {

    const [currentTask, setCurrentTask] = useState<TaskHandle>(() => createInitialHandle());

    useEffect(() => {
        if(currentTask){
            switch(currentTask.ui_state){
                case "idle":{
                    // Do nothing
                    break;
                }
                case "running":{
                    currentTask
                        .start(currentTask)
                        .then(handle => {
                            setCurrentTask(prev => {
                                if (!handle) return prev;
                                return { ...(prev ?? {}), ...handle };
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            setCurrentTask(prev => (prev ? { ...prev, ui_state: "error" } : prev));
                        });
                    break;
                }
                case "uploading":{
                    currentTask
                        .update(currentTask, (updated) => setCurrentTask(updated))
                        .then(handle => {
                            setCurrentTask(prev => {
                                if (!handle) return prev;
                                return { ...(prev ?? {}), ...handle };
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            setCurrentTask(prev => (prev ? { ...prev, ui_state: "error" } : prev));
                        });
                    break;
                }
                case "completed":{
                    currentTask
                        .complete(currentTask)
                        .then(handle => {
                            setCurrentTask(prev => {
                                if (!handle) return prev;
                                return { ...(prev ?? {}), ...handle };
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            setCurrentTask(prev => (prev ? { ...prev, ui_state: "error" } : prev));
                        });
                    break;
                }
            }
        }
    }, [currentTask?.ui_state]);



    return (
        <Layout >
            
            <div className="mx-auto max-w-7xl flex gap-3 justify-center">
                <div className="flex-2">
                    <CreateTaskForm 
                        onStartUploadTask={( file, filename) => {
                            console.log("Running Upload");
                            const handle: TaskHandle = {
                                ui_state: "running",
                                task: undefined,
                                file: file,
                                file_name: filename,
                                start: startUploadTask,
                                update: updateUploadTask,
                                complete: completeUploadTask
                            };

                            setCurrentTask(handle);
                        }} 
                        onStartHlsBuildTask={(media, params)=>{
                            console.log("Running HLS");
                            const handle: TaskHandle = {
                                ui_state: "running",
                                task: undefined,
                                media: media,
                                params: params,
                                start: startHlsBuildTask,
                                update: updateHlsBuildTask,
                                complete: completeHlsBuildTask
                            };

                            setCurrentTask(handle);
                        }}
                    />
                </div>
                <div className="flex-1">
                    <TaskStatus handle={currentTask} />
                </div>
            </div>
            <TaskTable 
                uiState={currentTask?.ui_state} 
                onRowClicked={(task) => {            
                    setCurrentTask((handle)=> {
                        return {
                            ...handle, 
                            task,
                        }
                    });
                }}/>
            <FileBrowser/>

        </Layout>
        
    );
}