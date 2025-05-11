import { useState, useRef, useEffect } from 'react';
import playlist from './assets/playlist.json';
import './App.css';
import { FaPlay, FaPause, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { PiDotsThreeBold } from "react-icons/pi";
import { LuGithub } from "react-icons/lu";
import { FiInfo } from "react-icons/fi";



import beats1 from './assets/images/beats1.svg';
import beats2 from './assets/images/beats2.svg';
import beats3 from './assets/images/beats3.svg';
import beats4 from './assets/images/beats4.svg';

const beats = [beats1, beats2, beats3, beats4];

function App() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);
  const [visitorCount, setVisitorCount] = useState(0);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStationChange = (newTrackIndex) => {
    const currentTime = audioRef.current.currentTime; // Get the current playback time
    setCurrentTrack(newTrackIndex); // Change the track
    setTimeout(() => {
      audioRef.current.currentTime = currentTime; // Resume from the same time
      audioRef.current.play(); // Automatically play the new track
      setIsPlaying(true); // Update the play button state
    }, 100); // Small delay to ensure the track is loaded
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

  const [currentBeat, setCurrentBeat] = useState(1);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentBeat((prev) => (prev % 4) + 1); // Cycle through 1 to 4
      }, 500); // Adjust the interval as needed
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault(); // Prevent default scrolling behavior
        handlePlayPause();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Cleanup on component unmount
    };
  }, [handlePlayPause]);

  useEffect(() => {
    // Simulate a new visitor joining every 5 seconds
    const interval = setInterval(() => {
      setVisitorCount((prevCount) => prevCount + 1);
    }, 5000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'ArrowLeft') {
        handlePrev(); // Trigger the previous track
      } else if (event.code === 'ArrowRight') {
        handleNext(); // Trigger the next track
      } else if (event.code === 'Space') {
        event.preventDefault(); // Prevent default scrolling behavior
        handlePlayPause(); // Toggle play/pause
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Cleanup on component unmount
    };
  }, [handlePrev, handleNext, handlePlayPause]);

  return (
    <div
    className="radio-container h-svh w-full flex justify-between flex-col items-start justify-left bg-cover bg-center transition-all duration-700"
    style={{ backgroundImage: `url(${playlist[currentTrack].cover})` }}
    onClick={handlePlayPause} // Add this onClick handler
  >
      <div id="crt-lines"></div>
      <div id="darken"></div>
      <div id="vignette"></div>
      <div id="top-ui" className="flex flex-row w-full items-center justify-between lg:px-10 px-6 lg:pt-10 pt-6 lg:pb-10 pb-10 z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1 flex flex-row items-start gap-2">
          <p className='text-white/30 hover:text-red-200/60 shadow-red text-lg'>listening now <span className='text-2xl'>{visitorCount}</span></p>
          <p className='text-white/30 hover:text-red-200/60 shadow-red text-3xl animate-ping'>•</p>
        </div>
        <div className="flex flex-row items-center gap-2">
        <a href="https://github.com/markjosephtx/lofi-radio" target="_blank" rel="noopener noreferrer" className="px-1 py-1">
      <LuGithub size={24} className="text-white/60 hover:text-lime-200/60 shadow" />
    </a>
    <a href="https://markjoseph.dev" target="_blank" rel="noopener noreferrer" className="px-1 py-1">
      <FiInfo size={24} className="text-white/60 hover:text-lime-200/60 shadow" />
    </a>
        </div>
      </div>

      <div
      className="lg:w-[400px] w-[320px] flex flex-col items-left lg:pl-10 pl-6 lg:pb-10 pb-10 z-10 gap-2"
      onClick={(e) => e.stopPropagation()} // Prevent click propagation
      >
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
        <div className='flex flex-row items-center gap-2 pb-3'>
        <button
            className="text-2xl py-1 bg-transparent border-none"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >{isPlaying ? 
          <img
            src={beats[currentBeat - 1]}
            alt="Beats Animation"
            className="w-5 h-5 transition-transform duration-100 ease-in-out shadow"
            style={{ transform: isPlaying ? 'scale(1)' : 'scale(1)' }}
          />
          : <PiDotsThreeBold size={22} className="text-white/60 hover:text-lime-200/60 shadow" /> }</button>
          <h2 className="font-semibold text-white hover:text-lime-200/90 shadow lg:text-xl text-lg/4">{playlist[currentTrack].title}</h2>
        </div>
        <div className="flex gap-2 mt-2 w-full pb-1">
          {playlist.map((track, idx) => (
            <button
              key={track.title}
              className={`lg;flex-1 w-12 h-2 rounded-full ${idx === currentTrack ? 'bg-lime-500/60 shadow animate-bounce' : 'bg-white/60 shadow'}`}
              onClick={() => { handleStationChange(idx)}}
            />
          ))}
        </div>
        <p className="text-sm text-white/60 hover:text-lime-200/60">change the radio station above</p>  
      </div>
    </div>
  );
}

export default App;
