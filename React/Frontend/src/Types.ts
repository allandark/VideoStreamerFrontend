


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