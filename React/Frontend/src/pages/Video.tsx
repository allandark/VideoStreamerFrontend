// import type { ReactNode } from "react";
import VideoPlayer from "../components/VideoPlayer";
import { useParams } from "react-router-dom";


export default function Video() {
    const { id } = useParams<{ id: string }>();
    const n_id = Number(id)
    
    return (
        <VideoPlayer video_id={n_id}/>
    );
}