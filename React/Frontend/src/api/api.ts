import type { UserModel, VideoModel } from "../Types";




export async function getUsers() {
  const res = await fetch(`/api/user/`, { credentials: 'include' });
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
  let url = `/api/video_meta/`;
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
  const res = await fetch(`/api/genre/`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }    
  const json  = await res.json();
  return json;
}

export async function getThumbnail(id: number){
  const res = await fetch(`/api/media/hls/thumbnail/${id}`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }    
  const data = await res.blob();
  return URL.createObjectURL(data);
}
