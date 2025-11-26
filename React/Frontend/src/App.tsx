import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Video from "./pages/Video";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import User from "./pages/User";



function App() {
  const [videoId, setVideoId] = useState<number>(0);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/video/:id" element={<Video />} />
        <Route path="/user" element={<User />} />
        {/* <Route path="/series" element={<User />} />
        <Route path="/movies" element={<User />} /> */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
  


export default App
