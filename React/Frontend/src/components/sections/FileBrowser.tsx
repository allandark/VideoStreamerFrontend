
import MediaFileCard from "../cards/MediaFileCard";
import { useEffect, useState } from "react";
import type { MediaModel } from "../../Types";
import { APIClient } from "../../api/api";


export default function FileBrowser(){

    const [medias, setMedias] = useState<MediaModel[]>([])

    useEffect(() => {
        const client = new APIClient();
                client.get<MediaModel>("media/upload").then(data =>{
                    setMedias(data);
                }).catch((err)=> console.error(err))

    }, []);

    return (
        <div>
            <h2 className="text-center text-2xl my-5">Media Files</h2>
            <div className="grid grid-cols-1 my-5 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 bg-gray-900 rounded-lg">
            {
                medias.map((value, i) => (
                    <MediaFileCard key={i} media={value}  />
                ))
            }
            </div>
        </div>
    );
}