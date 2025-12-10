import { APIClient } from "./api";
import type { TaskHandle, TaskModel } from "../Types";
import { sha256FileChunked } from "../utils/Utils";

export async function getTask(id: number): Promise<TaskModel | null>{
  const client = new APIClient();
  return client.get("media/task", id);
}


export async function getTasks(): Promise<TaskModel[]>{
  const client = new APIClient();
  return client.get("media/task");
}

/// --- Upload TASK --- ///

export async function startUploadTask(handle: TaskHandle){
  if(handle.file == null || handle.file_name == null){
    console.log("Error no file selected");
    return handle;
  }
  const fileName: string = handle.file_name;
  const chunkSize: number = 1024*1024;
  const fileSize: number = handle.file.size;
  const chunkCount: number = Math.ceil(fileSize/chunkSize);
  const mimetype: string = handle.file.type;
  const hash: string = await sha256FileChunked(handle.file);
  const payload = {
    media_id: 0,
    task_type: "upload_chunked",
    params: {
      file_name: fileName,
      chunk_size: chunkSize,
      chunk_count: chunkCount,
      hash: hash,
      mimetype: mimetype
    }
  }
  console.log("Starting upload task");

  try{
    const client = new APIClient();
    const data: TaskModel = await client.post("media/task", payload);
    console.log("Task created:", data);
    handle.task = data;
    if(handle.task.status == "error"){
      handle.ui_state = "idle";
    } else {
      handle.ui_state = "uploading";
    }
    
    return handle;
  } catch (error) {
    console.error("Failed to create task:", error);
  }
  return handle;
}

export async function uploadChunk(chunkSize: number, nextIndex: number, file: File, taskId: number){
  var offset = nextIndex*chunkSize;
  const blobSlice = file.slice(offset,offset+chunkSize);
  const formData = new FormData();
  formData.append("task_id", String(taskId));
  formData.append("chunk_index", String(nextIndex));
  formData.append("chunk_data", blobSlice); 
  try{

    const client = new APIClient();
    const data: TaskModel = await client.post("media/upload/chunk_upload", formData);

    console.log("Task created:", data);
    return data;
  }catch (error) {
    console.error("Failed to upload chunk:", error);
    return undefined;
  }
}

  export async function updateUploadTask( handle: TaskHandle, onProgress: (updatedTask: TaskHandle) => void){
    if (handle.task?.task_type !== "upload_chunked") {
      console.log("Error wrong task type");
      return handle;
    }
    if(handle.file == null){
      console.log("Error no file selected");
      return handle;
    }
    console.log("Uploading chunk");
    const chunkSize: number = 1024*1024;
    const chunkCount: number = handle.task?.params.chunk_count;
    
    // TODO: check for failed uploads instead of iterating
    for(var i = 0; i < chunkCount; i++){
      await uploadChunk(chunkSize, i ,handle.file, handle.task.id).then((task) => {
        handle.task = task;
        onProgress({...handle})
      }).catch(console.error) 

    }

    console.log("all chunks sent");
    if(handle.task.status == "error"){
      handle.ui_state = "idle";
    } else {
      handle.ui_state = "completed";
    }    
    return handle;
  }


export async function completeUploadTask(handle: TaskHandle){
  const payload = {
    task_id : handle.task?.id
  }
  console.log("Completing upload task");
  try{
    const client = new APIClient();
    const data:  TaskModel = await client.post("media/upload/chunk_complete", payload);

    handle.task = data;
    handle.ui_state = "idle";
    return handle;
  }catch (error) {
      console.error("Failed to upload completion:", error);
      return handle;
  }
}

/// --- HLS build TASK --- ///

export async function startHlsBuildTask(handle: TaskHandle){
  const payload = {
    media_id: handle.media?.id,
    task_type: "hls_build",
    params: handle.params
  }
  console.log("Initiating hls build task");
  try{
    const client = new APIClient();
    const data: TaskModel = await client.post("media/task", payload);
    console.log("Task created:", data);
    handle.task = data;
    if(handle.task.status == "error"){
      handle.ui_state = "idle";
    } else {
      handle.ui_state = "uploading";
    }    
    return handle;
  } catch (error) {
    console.error("Failed to create task:", error);
  }
  return handle;
}

export async function updateHlsBuildTask(handle: TaskHandle, onProgress: (updatedTask: TaskHandle) => void){
  if(handle == undefined || handle.task == undefined) {
    return handle;
  }
  const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
  const maxIterations: number = 600;
  const timeoutMs: number = 1000;

  for( let i=0; i < maxIterations; i++){
    const task: TaskModel|null = await getTask(handle.task.id);
    if(task){
      handle.task = task;
        
      onProgress({...handle});
      if( task.status == "done"){
        break;
      }    
    } 
    await sleep(timeoutMs);
  }

  handle.ui_state = "idle";
  return handle;
}

export async function completeHlsBuildTask(handle: TaskHandle){
  // Kept for consistent interface, do nothing
  return handle;
}