
export default function Header() {
    const hoverStyle = "text-lg font-medium hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-colors duration-300 "
    return (

    <div className="flex items-center justify-between px-6 py-3 bg-linear-to-r from-gray-800 to-gray-900 text-white shadow-md">
    {/* Left Section: Logo + Title */}
    <div className="flex items-center gap-4">
        <img className="h-12 w-12 rounded-lg" src="/assets/icon.svg"/> 
        <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">Video Streamer</h1>
    </div>

    {/* Center Navigation */}
    <nav className="absolute left-1/2 transform -translate-x-1/2 flex space-x-8">
        <a
        className={hoverStyle}
        href={`/home`}
        >
        Home
        </a>
        <a
        className={hoverStyle}
        href={`/user`}
        >
        User
        </a>
    </nav>
   
    </div>

    );
}