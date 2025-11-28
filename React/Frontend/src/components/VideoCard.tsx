import type { VideoModel } from "../Types";
import { useState, useEffect } from "react";
import { getThumbnail } from "../api/api";


interface VideoCardProps {
  video: VideoModel;
  onClick: (video: VideoModel) => void;
}

export default function VideoCard({video, onClick}: VideoCardProps){
    const [thumbnailUrl, setThumbnailUrl] = useState<string>("");    
    useEffect(() => {
        getThumbnail(video.media_id).then(setThumbnailUrl).catch(console.error);
    }, [video.media_id]);

    return (
     

        <div
        onClick={() => onClick(video)}
        className="bg-gray-800 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 overflow-hidden cursor-pointer"
        >
        {/* Thumbnail */}
        <div className="relative w-full aspect-video">
            <img src={thumbnailUrl !== "" ? thumbnailUrl : "/src/assets/icon.png"} alt="Thumbnail" className="w-full h-full object-cover"/>
            {/* Optional overlay on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Content */}
        <div className="p-4">
            <h3 className="text-xl font-bold text-gray-100">{video.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{video.description}</p>
        </div>
        </div>


    );
}


