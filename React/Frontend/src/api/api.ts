import type { UserModel, VideoModel, GenreModel } from "../Types";



export const API_URL = "http://localhost:5000"
export const FRONT_URL = "http://localhost:5173"



export async function getUsers() {
  const res = await fetch(`${API_URL}/api/user/`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }    
  const json: UserModel[] = await res.json();
  return json;
}


export async function getVideos(){
  const res = await fetch(`${API_URL}/api/video_meta`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }  
  const json: VideoModel[] = await res.json();
  return json;
}

export async function getGenres(){
  const res = await fetch(`${API_URL}/api/genre/`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }    
  const json  = await res.json();
  return json;
}

export async function getThumbnail(id: number){
  const res = await fetch(`${API_URL}/api/media/thumbnail/${id}`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }    
  const data = await res.blob();
  return URL.createObjectURL(data);
}
