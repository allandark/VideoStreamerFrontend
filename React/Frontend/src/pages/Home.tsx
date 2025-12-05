import Layout from "../components/Layout";
import type { VideoModel, GenreModel } from "../Types";
import { useEffect, useState } from "react";
import { getVideos, getGenres } from "../api/api";
import VideoCard from "../components/VideoCard";
import { useNavigate } from "react-router-dom";




export default function Home() {
    const [videos, setVideos] = useState<VideoModel[]>([]);
    const [genres, setGenres] = useState<GenreModel[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string>("");
    const [selectedSearch, setSelectedSearch] = useState<string>("");
    const navigate = useNavigate();
    useEffect(() => {

        getVideos(selectedGenre, selectedSearch).then(data =>{
            console.log(data);
            setVideos(data);
        }).catch(err =>{
            console.log(err);
        });
        getGenres().then(data =>{
            console.log(data);
            setGenres(data);
        }).catch(err =>{
            console.log(err);
        });
        
    }, [selectedGenre, selectedSearch]);


    const onPlayVideo = (video : VideoModel) => {
        console.log("Starting video");
        console.log(video.title);
        navigate(`/video/${video.media_id}`);
    }

    return (
        <Layout >
            <div>
                
                <h2 className="text-3xl text-gray-100 font-bold text-center drop-shadow mb-8">Browse Videos</h2>

                
            {/* Controls: Search + Genre */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Search Field */}
                <div className="relative flex-1">
                    <input
                    type="text"
                    onChange={(event) => {
 
                        setSelectedSearch(event.target.value);
                    } }
                    placeholder="Search videos..."
                    className="w-full rounded-lg bg-gray-800/70 text-gray-100 placeholder-gray-400 px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {/* Optional search icon */}
                    <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.3-4.3" />
                    </svg>
                </div>

                {/* Genre Dropdown */}
                <div className="sm:w-56">
                    <select
                    className="w-full rounded-lg bg-gray-800/70 text-gray-100 px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue=""
                    onChange={(event) => {
                        console.log("on change: ", event.target.value);
                        setSelectedGenre(event.target.value);
                    }}
                    >
                    <option value="">
                        Select genre…
                    </option>
                    {genres.map((g, i) => (
                            <option key={i} value={g.name}>{g.name}</option>
                        ))}
                    </select>
                </div>
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                
            
            {
                videos.map((value, i) => (
                    <VideoCard key={i} video={value} onClick={onPlayVideo} />
                ))
            }

            
            </div>


            </div>
              
            

        </Layout>
    );
}