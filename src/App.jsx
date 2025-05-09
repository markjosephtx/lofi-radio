import { useState, useRef } from 'react';
import playlist from './assets/playlist.json';
import './App.css';
import { FaPlay, FaPause, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";



const backgrounds = [
  {
    name: 'Cafe',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Night',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Study',
    url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Food',
    url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Day',
    url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
  },
];

function App() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [bgIndex, setBgIndex] = useState(0);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
    setTimeout(() => audioRef.current.play(), 100);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
    setTimeout(() => audioRef.current.play(), 100);
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleBgChange = () => {
    setBgIndex((prev) => (prev + 1) % backgrounds.length);
  };

  const handleVolume = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value;
  };

  return (
    <div
      className="min-h-screen w-full flex items-end justify-left bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url(${playlist[currentTrack].cover})` }}
    >
      <div className="w-[320px] flex flex-col items-left pl-2 pb-2">
        <button
          className="mb-4 px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition"
          onClick={handleBgChange}
        >
          Change Room: {backgrounds[bgIndex].name}
        </button>
    
        <audio
          ref={audioRef}
          src={playlist[currentTrack].url}
          onEnded={handleEnded}
          autoPlay={isPlaying}
        />
        <div className="flex items-center gap-4 mb-4">
          <button
            className="text-2xl px-2 py-1 bg-transparent border-none"
            onClick={handlePrev}
            aria-label="Previous"
          ><FaAnglesLeft size={28} className="text-white" /></button>
          <button
            className="text-2xl px-2 py-1 bg-transparent border-none"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >{isPlaying ? <FaPause size={28} className="text-lime-300" /> : <FaPlay size={28} className="text-white" /> }</button>
          <button
            className="text-2xl px-2 py-1 bg-transparent border-none"
            onClick={handleNext}
            aria-label="Next"
          ><FaAnglesRight size={28} className="text-white" /> </button>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          className="w-full mb-2 accent-indigo-500"
        />
        <h2 className="text-xl font-bold mb-1">{playlist[currentTrack].title}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{playlist[currentTrack].artist}</p>
        <div className="flex gap-2 mt-2 w-full">
          {playlist.map((track, idx) => (
            <button
              key={track.title}
              className={`flex-1 h-2 rounded-full ${idx === currentTrack ? 'bg-indigo-500' : 'bg-gray-300'}`}
              onClick={() => { setCurrentTrack(idx); setIsPlaying(true); setTimeout(() => audioRef.current.play(), 100); }}
              aria-label={`Go to track ${track.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
