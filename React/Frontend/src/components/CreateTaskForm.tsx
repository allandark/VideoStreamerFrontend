import { useEffect, useState } from "react";
import type { MediaModel } from "../Types";
import { getMediaFiles } from "../api/api";

interface HlsBuildFormProps{
    onUpdate: (media: MediaModel|undefined, params : JSON) => void;
}

function HlsBuildForm({onUpdate}: HlsBuildFormProps){

    const PLAYLIST_TEMPLATE = "http://localhost:8080/api/media/hls/playlist/<MEDIA_ID>/";
    const SEGMENT_TEMPLATE  = "http://localhost:8080/api/media/hls/chunk/<MEDIA_ID>/";
    const defaultParams: string = `{\n\t\"hls_segment_base_url\": \"${SEGMENT_TEMPLATE}\",\n\t\"hls_playlist_base_url\":\"${PLAYLIST_TEMPLATE}\"\n}`;
    

    const [medias, setMedias] = useState<MediaModel[]>([]);
    const [params, setParams] = useState<string>(defaultParams);
    const [currentMediaID,setCurrentMediaID] = useState<number>();

    
    function updateSegmentUrlFromJson(jsonStr: string, mediaId: string | number): string {
        // Parse, change only that property, then re-stringify.
        const obj = JSON.parse(jsonStr) as Record<string, unknown>;

        if (typeof obj.hls_segment_base_url === "string") {
            obj.hls_segment_base_url = obj.hls_segment_base_url.replace(/<MEDIA_ID>/g, String(mediaId));
            console.log(obj.hls_segment_base_url)
        }
        if(typeof obj.hls_playlist_base_url === "string"){
            obj.hls_playlist_base_url = obj.hls_playlist_base_url.replace(/<MEDIA_ID>/g, String(mediaId));  
            console.log(obj.hls_playlist_base_url)          
        }

        return JSON.stringify(obj, null, 2); 
    }


    const buildOutput = () => {
        const media = medias.find(media => media.id == currentMediaID);
        const obj = JSON.parse(params);
        onUpdate(media, obj);
    };

    useEffect(() => {
        getMediaFiles().then(data =>{
                console.log(data);
                setMedias(data);
            }).catch(err =>{
                console.log(err);
        });

    }, []);

    
    useEffect(() => {
    if (medias.length > 0) {
        const firstId = medias[0].id;
        setCurrentMediaID(firstId);
        setParams(updateSegmentUrlFromJson(defaultParams, firstId));
        buildOutput();
    } else {
        setParams(defaultParams); // keep placeholder
    }
    }, [medias]);


    return (
      <div>

        
        <label className="flex items-center my-3 gap-2">
        <span className="text-gray-400">Media:</span>
        <select
            className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 text-gray-200
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               disabled:opacity-50 disabled:cursor-not-allowed"
               onChange={(e)=> {
                
                
                setCurrentMediaID(Number(e.target.value));
                setParams( updateSegmentUrlFromJson(params,e.target.value));
                buildOutput();
            }}
                value={currentMediaID}
        >
            {medias.map((value, i ) => (
                <option key={i} value={value.id} >[{value.id}] {value.name}</option>
            ))}
        </select>
        </label>

        <label className="block my-3">
        <span className="text-gray-400">Params:</span>
        <textarea 
            className="block w-full mt-2 font-mono text-sm text-gray-300 border border-gray-600 rounded-lg bg-gray-800 focus:outline-none focus:ring-2"
            rows={8}            
            onChange={(e)=> {
                setParams(e.target.value);
                buildOutput();
            }}
            value={params}
        />
        </label>
        </div>
    );
}

interface UploadFileProps{
    onFileUpdate: (file: File | undefined, filename: string) => void;
}

function UploadFileForm({onFileUpdate}: UploadFileProps){
    const [selectedFile, setSelectedFile] = useState<File|undefined>(undefined);
    const [currentName, setCurrentName] = useState<string>("");
    return (
        <div>
            <label>Name: </label>
            <input
                className="block w-full text-gray-300 border border-gray-600 rounded-lg cursor-pointer bg-gray-700 focus:outline-none focus:ring-2"
                type="text"
                value={currentName}
                onChange={(e)=>{setCurrentName(e.target.value)}}
            >
            </input><br></br>
            <input 
                className="block w-full text-gray-300 border border-gray-600 rounded-lg cursor-pointer bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
                type="file" 
                accept=".mp4, .mkv, image/*"
                onChange={
                (e: React.ChangeEvent<HTMLInputElement>) => {                        
                    const f = e.currentTarget.files?.[0];                                
                    setSelectedFile(f);
                    onFileUpdate(f, currentName);
                }
            }></input><br></br>
            <FileInfo file={selectedFile}/> 
        </div>
    );
}



interface FileInfoProps {
  file: File | undefined; 
}

function FileInfo({file} : FileInfoProps){
        if(file !== undefined){
            return (
                <div className="my-4 p-2 bg-gray-700 rounded-lg shadow-md text-gray-200">
                    <ul className="space-y-2">

                        <li>
                            <span className="font-semibold text-gray-400">Filename:</span> {file.name}
                        </li>
                        
                        <li>
                            <span className="font-semibold text-gray-400">Size:</span>{" "}
                            {(file.size / 1024).toFixed(2)} KB
                        </li>
                        
                        <li>
                            <span className="font-semibold text-gray-400">Type:</span> {file.type}
                        </li>
                    </ul>
                </div>
            );
        }
        return (<div></div>);
    }


interface CreateTaskProps {
  onStartUploadTask: ( file : File, filename: string) => void;  
  onStartHlsBuildTask: ( media: MediaModel, params: JSON) => void;
}

export default function CreateTaskForm({onStartUploadTask, onStartHlsBuildTask}: CreateTaskProps){
    const [selectedFile, setSelectedFile] = useState<File|undefined>(undefined);
    const [currentFilename, setCurrentFilename] = useState<string>("");
    const [taskName, setTaskName] = useState<string>("hls_build");
    const [currentMedia, setCurrentMedia] = useState<MediaModel>();
    const [params, setParams] = useState<JSON>();
    
    return (
        <div className="text-center w-full">
            <form 
                className="mx-auto p-6 bg-gray-800 rounded-lg shadow-md space-y" 
                onSubmit={(e) => {
                    e.preventDefault(); 
                    console.log("Starting task");
                    if (taskName == "upload_chunked"){
                        if (selectedFile){
                            onStartUploadTask(selectedFile, currentFilename);
                        }
                    }
                    else if(taskName == "hls_build"){
                        if(params && currentMedia){
                            onStartHlsBuildTask(currentMedia, params);
                        }
                        else {
                            console.error("No param or media selected");
                        }
                    }
  
                    
                }}
            >
                <h2 className="text-xl font-semibold text-white mb-4">Run Task</h2>
                <label className="flex items-center my-3 gap-2">
                <span className="text-gray-400">Type:</span>
                <select 
                    onChange={(e)=> setTaskName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 text-gray-200
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option 
                        value="hls_build"
                        className="block text-gray-300 border border-gray-600 rounded-lg cursor-pointer bg-gray-700"
                    >HLS Build</option>
                    <option 
                        value="upload_chunked"
                        className="block text-gray-300 border border-gray-600 rounded-lg cursor-pointer bg-gray-700"
                    >Upload File</option>
                </select>
                </label>

                {taskName == "hls_build" ? (
                    <HlsBuildForm onUpdate={(media, _params) => {
                        if(_params){
                            setParams(_params);
                        }
                        if(media){
                            setCurrentMedia(media);
                        }
                    }}/> ):
                    (<div></div>)
                }
                {taskName == "upload_chunked" ? (
                    <UploadFileForm onFileUpdate={(file, filename) => {
                        if(file){
                            setSelectedFile(file);
                            if(filename === ""){
                                setCurrentFilename(file.name);
                            }else {
                                setCurrentFilename(filename);
                            }
                        }
  
                        
                    }}
                    /> ):
                    (<div></div>)
                }

                <input  
                    className="w-full py-2 px-4 bg-green-700 hover:bg-green-500 text-white font-semibold rounded-lg transition duration-200" 
                    type="submit"    
                    value="Start Task"                
                ></input><br></br>
            </form>
        </div>
    );
}