import { useEffect, useState, useRef } from 'react';
import Hls from 'hls.js';
import { API_URL } from '../api/api.ts'

interface VideoProps {
  video_id: number;
}


export default function VideoPlayer({video_id}: VideoProps){
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [levels, setLevels] = useState<{ height: number }[]>([]);
    const [currentLevel, setCurrentLevel] = useState<number | null>(null);
    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState(0);
    
    const [showControls, setShowControls] = useState(true);
    const hideTimeout = useRef<number | null>(null);
    
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => setCurrentTime(video.currentTime);
        video.addEventListener("timeupdate", updateTime);

        const onFsChange = () => {
            const isFs = !!document.fullscreenElement;
            setFullscreen(isFs);
        }
        document.addEventListener('fullscreenchange', onFsChange);

        // Initialize hls.js
        if (Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;

            hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
                setLevels(data.levels.map(l => ({ height: l.height })));
                setCurrentLevel(hls.currentLevel); 
            });

            hls.loadSource(`${API_URL}/api/media/playlist/${video_id}`);
            hls.attachMedia(video);
        }

        // Progress tracking
        const onLoadedMetadata = () => setDuration(video.duration || 0);
        const onTimeUpdate = () =>
        setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);

        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('timeupdate', onTimeUpdate);

        return () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('timeupdate', onTimeUpdate);
            hlsRef.current?.destroy();
            hlsRef.current = null;
        };
    }, []);

    
    function formatTime(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    
    // Controls
    const play = () => videoRef.current?.play();
    const pause = () => videoRef.current?.pause();

    
    const onSeek: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const v = videoRef.current;
        if (!v || !duration) return;
        const pct = parseFloat(e.target.value);
        v.currentTime = (pct / 100) * duration;
        setProgress(pct); // UI sync
    };

    
    const onVolumeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = parseFloat(e.target.value);
        setVolume(value);
        if (videoRef.current) videoRef.current.volume = value;
    };

    
    const onQualityChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const idx = parseInt(e.target.value, 10);
        if (!Number.isNaN(idx) && hlsRef.current) {
        // Instant switch:
        hlsRef.current.currentLevel = idx;
        setCurrentLevel(idx);
        }
    };

    
    const onFullscreen = async () => {
        const container = containerRef.current || document.documentElement;      
        try {
            if (fullscreen) {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                }
            }
            else {                
                if (container.requestFullscreen) {
                    await container.requestFullscreen();
                }
            }
        } catch (err) {
            console.error('Fullscreen toggle failed:', err);
        }

    };

    const onVideoDblClick = () => onFullscreen();

    const handleMouseMove = () => {
        setShowControls(true);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => setShowControls(false), 3000); // hide after 3s
    };
    
    return (
        <>
        {
            (video_id == 0 )?
            <div className='bg-black text-white'>No video selected</div>:
                
            <div 
                className="fixed inset-0 flex flex-col bg-black"
                onMouseMove={handleMouseMove}
            >
                {/* Video Area */}
                <div className="relative w-full h-full">
                    <video 
                        ref={videoRef} 
                        className="w-full h-full object-contain" 
                        onDoubleClick={onVideoDblClick}
                    />
                
                {/* Control Bar */}        
 
                <div
                className={`absolute bottom-0 left-0 w-full h-20 bg-gray-900/70 backdrop-blur-md flex items-center px-4 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                }`}
                >

                    {/* Left: Play/Pause */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button onClick={play} className="text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">▶</button>
                        <button onClick={pause} className="text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">⏯</button>
                    </div>

                    {/* Middle: Progress */}
                                                                  
                    <div className="flex items-center gap-3 flex-1 justify-center">
                        <span className="text-white text-sm tabular-nums w-16 text-right">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={progress}
                            onChange={onSeek}
                            className="w-full h-2 accent-blue-500"
                            />
                        <span className="text-white text-sm tabular-nums w-16">{formatTime(duration)}</span>
                    </div>
                   
                    {/* Right: Volume, Quality, Fullscreen */}
                    <div className="flex items-center gap-3 shrink-0 ml-auto">
                        <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={onVolumeChange}
                        className="w-28 accent-green-500"
                        />

                        <select
                        value={currentLevel ?? -1}
                        onChange={onQualityChange}
                        className="bg-gray-700 text-white px-2 py-1 rounded"
                        >
                        ⚙
    
                        {levels.map((l, i) => (
                            <option key={i} value={i}>{l.height}p</option>
                        ))}
                         <option value={-1}>Auto</option>
                        </select>

                        <button
                        onClick={onFullscreen}
                        className="text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                        >
                        ⛶
                        </button>
                    </div>
                    </div>
                </div>
                </div>  
              
            }
        </>
    );
}