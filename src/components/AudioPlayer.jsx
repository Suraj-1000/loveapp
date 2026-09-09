import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Local romantic song file from public folder
  const audioUrl = encodeURI('/Stephen Sanchez - Until I Found You (Instrumental).mp3');

  const startAudio = () => {
    if (!audioRef.current || isPlaying) return;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.log('Autoplay blocked by browser policy until user interaction:', err);
      });
  };

  useEffect(() => {
    // Attempt instant autoplay on page load
    startAudio();

    // Attach global user interaction listeners so music starts automatically on first click/touch/hover
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('mousemove', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('mousemove', handleFirstInteraction);
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Audio play failed:', err);
        });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      <button
        onClick={toggleMusic}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-md text-xs font-semibold border transition-all shadow-lg cursor-pointer ${
          isPlaying
            ? 'bg-rose-600/80 text-white border-rose-400 animate-pulse'
            : 'bg-slate-900/80 text-rose-200 border-rose-500/30 hover:bg-slate-800'
        }`}
      >
        <Music className="w-3.5 h-3.5 text-rose-300" />
        <span>{isPlaying ? 'Until I Found You 🎵' : 'Play Our Song 🎵'}</span>
        {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
      </button>
    </div>
  );
};
