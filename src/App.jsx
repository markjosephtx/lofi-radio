import { useState, useRef } from 'react';
import playlist from './assets/playlist.json';
import './App.css';
import { FaPlay, FaPause, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { PiDotsThreeBold } from "react-icons/pi";
import { CgLoadbarSound } from "react-icons/cg";

function App() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
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

  const handleVolume = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value;
  };

  return (
    <div
      className="min-h-screen w-full flex items-end justify-left bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url(${playlist[currentTrack].cover})` }}
    >
      <div id="crt-lines"></div>
      <div id="darken"></div>
      <div id="vignette"></div>

      <div className="lg:w-[400px] w-[320px] flex flex-col items-left lg:pl-10 pl-6 lg:pb-10 pb-10 z-6 gap-2">
        <audio
          ref={audioRef}
          src={playlist[currentTrack].url}
          onEnded={handleEnded}
          autoPlay={isPlaying}
        />
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-2xl px-2 py-1 bg-transparent border-none"
            onClick={handlePrev}
            aria-label="Previous"
          ><FaAnglesLeft size={28} className="text-white/60 hover:text-lime-200/60 shadow" /></button>
          <button
            className="text-2xl px-2 py-1 bg-transparent border-none"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >{isPlaying ? <FaPause size={28} className="text-lime-300/60 hover:text-white/60 shadow" /> : <FaPlay size={28} className="text-white/60 hover:text-lime-200/60 shadow" /> }</button>
          <button
            className="text-2xl px-2 py-1 bg-transparent border-none"
            onClick={handleNext}
            aria-label="Next"
          ><FaAnglesRight size={28} className="text-white/60 hover:text-lime-200/60 shadow" /> </button>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          className="w-full mb-2 accent-white shadow hidden sm:block"
        />
        <div className='flex flex-row items-center gap-1 pb-3'>
        <button
            className="text-2xl py-1 bg-transparent border-none"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >{isPlaying ? <CgLoadbarSound size={24} className="text-lime-300/60 hover:text-white/60 shadow" /> : <PiDotsThreeBold size={22} className="text-white/60 hover:text-lime-200/60 shadow" /> }</button>
          <h2 className="font-semibold text-white hover:text-lime-200/90 shadow lg:text-xl text-lg/4">{playlist[currentTrack].title}</h2>
        </div>
        <div className="flex gap-2 mt-2 w-full pb-1">
          {playlist.map((track, idx) => (
            <button
              key={track.title}
              className={`lg;flex-1 w-12 h-2 rounded-full ${idx === currentTrack ? 'bg-lime-500/60 shadow' : 'bg-white/60 shadow'}`}
              onClick={() => { setCurrentTrack(idx); setIsPlaying(true); setTimeout(() => audioRef.current.play(), 100); }}
              aria-label={`Go to track ${track.title}`}
            />
          ))}
        </div>
        <p className="text-sm text-white/60 hover:text-lime-200/60">change the radio station above</p>  
      </div>
    </div>
  );
}

export default App;
