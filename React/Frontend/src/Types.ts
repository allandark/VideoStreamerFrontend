


export interface UserModel {
  id: number,
  user_name: string,
  email: string,
  hashed_password: string,
  user_type: string,
  creation_date: Date 
};

export interface VideoModel{
  id: number,
  title: string,
  description : string,
  file_path: string,
  language: string,
  duration: number,
  screen_width: number,
  screen_height: number,
  rating: number,
  upload_data: Date,
  media_id: number
  genres: GenreModel[]
}

export interface GenreModel{
  id: number,
  name: string,
  rating: number
}

export interface GenreCreate{
  id?: number,
  name: string,
  rating: number
}



export interface HlsBuildTaskParams{
  hls_segment_base_url: string,
  hls_playlist_base_url: string
}

export interface UploadTaskParams{
  received_chunks: Record<number, boolean>
  file_name: string,
  chunk_size: number,
  chunk_count: number,
  mimetype: string
}

export type TaskModel = 
  | {
    id: number;
    media_id: number;
    task_type: "hls_build";
    status: string;
    error_message: string;
    creation_date: string;
    params: HlsBuildTaskParams;
  }
  | {
    id: number;
    media_id: number;
    task_type: "upload_chunked";
    status: string;
    error_message: string;
    creation_date: string;
    params: UploadTaskParams;
  }


export interface MediaModel{
  id: number,
  name: string,
  mimetype: string,
  hash: string,
  tasks: TaskModel[]
}



export interface TaskHandle{
  task?: TaskModel;
  ui_state: "idle" | "uploading" | "running" | "completed" | "error";
  file?: File;
  file_name?: string;
  params?: JSON;
  media?: MediaModel;

  start: (handle: TaskHandle) => Promise<TaskHandle | undefined>;
  update: (handle: TaskHandle, onProgress: (updatedTask: TaskHandle) => void) => Promise<TaskHandle | undefined>;
  complete: (handle: TaskHandle) => Promise<TaskHandle | undefined>;

}



const noopStart: TaskHandle["start"] = async (_h) => undefined;
const noopUpdate: TaskHandle["update"] = async (_h, _onProgress) => undefined;
const noopComplete: TaskHandle["complete"] = async (_h) => undefined;


export function createInitialHandle(): TaskHandle {
  return {
    ui_state: "idle",
    start: noopStart,   
    update: noopUpdate,
    complete: noopComplete,
  };
}
