import { APIClient } from "./api";
import type { VideoModel } from "../Types";

export async function getVideos(genre_name: string = "", search: string = ""){
  const params = new URLSearchParams();
  if(genre_name){
    params.append("genre", genre_name.toLowerCase());
  }
  if (search) {
    params.append("search", search.toLowerCase());
  }
  const query = params.toString();

  const client = new APIClient();
  const data : VideoModel[] = await client.get('video_meta', query);  
  return data;
}



export async function getThumbnail(id: number){
  const client = new APIClient();
  const blob : Blob|null = await client.getBlob("media/hls/thumbnail", id);
  return blob? URL.createObjectURL(blob) : "";
}
