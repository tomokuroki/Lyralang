import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, Sparkles } from 'lucide-react';

const TRACKS = [
  {
    id: 'last-goodbye',
    title: 'Last Goodbye',
    subtitle: 'Composed & synthesized entirely in Lyra',
    src: '/audio/last_goodbye_style_lyra.mp3',
    genre: 'Synth / Cinematic',
    note: 'Multi-track arrangement with polyphonic pads, bassline, and procedural percussion.'
  },
  {
    id: 'space-oddity',
    title: 'Space Oddity (Preview)',
    subtitle: 'Full score synthesized from plain text code',
    src: '/audio/space_oddity_lyra_preview.mp3',
    genre: 'Acoustic / Polyphony',
    note: 'Demonstrating physical instrument modeling, spatial reverb diffusion, and dynamic tempo changes.'
  }
];

function AudioTrackCard({ track, isCurrent, isPlaying, onTogglePlay }) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onEnded = () => {
      onTogglePlay(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [onTogglePlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isCurrent && isPlaying) {
      audio.play().catch(() => onTogglePlay(false));
    } else {
      audio.pause();
    }
  }, [isCurrent, isPlaying, onTogglePlay]);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = pct * duration;
    setCurrentTime(audio.currentTime);
  };

  const formatTime = (sec) => {
    if (!Number.isFinite(sec) || sec <= 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`p-6 rounded-xl border transition-all ${
      isCurrent && isPlaying 
        ? 'bg-[#0e0e0e] border-white/[0.2] shadow-2xl' 
        : 'bg-[#0a0a0a] border-white/[0.08] hover:border-white/[0.14]'
    }`}>
      <audio ref={audioRef} src={track.src} preload="metadata" />

      {/* Top info */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTogglePlay(!isPlaying)}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-95 shrink-0 ${
              isCurrent && isPlaying
                ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                : 'bg-white/[0.04] hover:bg-white/[0.1] text-white border-white/[0.1] hover:border-white/[0.2]'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <span>{track.title}</span>
              {isCurrent && isPlaying && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-normal">
              {track.subtitle}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.02] text-neutral-400 shrink-0">
          {track.genre}
        </span>
      </div>

      <p className="text-xs text-neutral-400 leading-relaxed mb-5">
        {track.note}
      </p>

      {/* Scrubber / Progress bar */}
      <div className="space-y-1.5">
        <div
          onClick={handleSeek}
          className="h-1.5 w-full bg-white/[0.08] hover:bg-white/[0.12] rounded-full overflow-hidden cursor-pointer relative"
        >
          <div
            className="h-full bg-white transition-all duration-100 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ShowcaseSection() {
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = (trackId, shouldPlay) => {
    if (activeTrackId === trackId) {
      setIsPlaying(shouldPlay);
    } else {
      setActiveTrackId(trackId);
      setIsPlaying(true);
    }
  };

  return (
    <section id="showcase" className="py-24 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
              Made with Lyra
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl">
              Listen to full musical pieces written line-by-line as pure code and synthesized entirely by the Lyra engine without any recorded audio samples.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Procedural Audio Synthesis</span>
          </div>
        </div>

        {/* 2 Track Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TRACKS.map((track) => (
            <AudioTrackCard
              key={track.id}
              track={track}
              isCurrent={activeTrackId === track.id}
              isPlaying={activeTrackId === track.id && isPlaying}
              onTogglePlay={(playState) => handleToggle(track.id, playState)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
