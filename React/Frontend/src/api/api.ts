import type { TaskModel,  UserModel, VideoModel, TaskHandle } from "../Types";
import { createSHA256 } from "hash-wasm";

// const API_URL = "/api";
const API_URL = "http://localhost:8080/api";



export async function getUsers() {
  const res = await fetch(`${API_URL}/user/`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }    
  const json: UserModel[] = await res.json();
  return json;
}


export async function getVideos(genre_name: string = "", search: string = ""){
  let query: string = "?";
  
  if (genre_name !== ""){
    query = `${query}genre=${genre_name.toLowerCase()}`

  }
  if (search !== ""){
    if( genre_name !== ""){
      query = `${query}&search=${search.toLowerCase()}`
    }else {
      query = `${query}search=${search}`
    }
  }
  let url = `/${API_URL}/video_meta/`;
  if (query !== "?"){
    url =  `${url}${query}`;
  } 
  console.log(url);
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }  
  const json: VideoModel[] = await res.json();
  return json;
}

export async function getGenres(){
  const res = await fetch(`${API_URL}/genre/`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }    
  const json  = await res.json();
  return json;
}

export async function getThumbnail(id: number){
  const res = await fetch(`${API_URL}/media/hls/thumbnail/${id}`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }    
  const data = await res.blob();
  return URL.createObjectURL(data);
}


export async function getMediaFiles(){
  const res = await fetch(`${API_URL}/media/upload`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }    
  const json  = await res.json();
  return json;
}

export async function getTask(id: number){
  const res = await fetch(`${API_URL}/media/task/${id}`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }    
  const json  = await res.json();
  return json;
}


export async function getTasks(){
  const res = await fetch(`${API_URL}/media/task`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }    
  const json  = await res.json();
  return json;
}



async function sha256FileChunked(file: File): Promise<string>{
  const hasher = await createSHA256();
  const reader = file.stream().getReader();
  while(true){
    const {done, value} = await reader.read();
    if( done) break;
    hasher.update(value);
  }

  return hasher.digest("hex");
}

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
    const response = await fetch(`${API_URL}/media/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const data: TaskModel = await response.json();
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
        const response = await fetch(`${API_URL}/media/upload/chunk_upload`, {
          method: "POST",
          body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data: TaskModel = await response.json();
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
    const response = await fetch(`${API_URL}/media/upload/chunk_complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const data: TaskModel = await response.json();
    handle.task = data;
    handle.ui_state = "idle";
    return handle;


    }catch (error) {
      console.error("Failed to upload completion:", error);
      return handle;
  }
}


export async function startHlsBuildTask(handle: TaskHandle){
  const payload = {
    media_id: handle.media?.id,
    task_type: "hls_build",
    params: handle.params
  }
  console.log("Completing upload task");
  try{
    const response = await fetch(`${API_URL}/media/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const data: TaskModel = await response.json();
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
    var task: TaskModel = await getTask(handle.task.id);
    handle.task = task;
    onProgress({...handle});
    if( task.status == "done"){
      break;
    }    
    await sleep(timeoutMs);
  }

  handle.ui_state = "idle";
  return handle;
}

export async function completeHlsBuildTask(handle: TaskHandle){

  return handle;
}