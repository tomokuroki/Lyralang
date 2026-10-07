import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const TRACKS = [
  {
    id: 'last-goodbye',
    title: 'Last Goodbye',
    subtitle: 'Composed & synthesized entirely in Lyra',
    src: '/audio/last_goodbye_style_lyra.mp3',
    note: 'Multi-track arrangement with polyphonic pads, bassline, and procedural percussion.'
  },
  {
    id: 'space-oddity',
    title: 'Space Oddity (Preview)',
    subtitle: 'Full score synthesized from plain text code',
    src: '/audio/space_oddity_lyra_preview.mp3',
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

  const waveBars = [22, 46, 30, 70, 42, 82, 54, 36, 64, 88, 48, 74, 34, 58, 28, 78, 50, 92, 38, 66, 44, 84, 56, 32, 72, 48, 62, 26, 52, 40, 68, 30];

  return (
    <article className={`audio-track-card ${isCurrent && isPlaying ? 'is-playing' : ''}`}>
      <audio ref={audioRef} src={track.src} preload="metadata" />

      <div className="track-card-copy">
        <h3>{track.title}</h3>
        <p>{track.subtitle}</p>
      </div>

      <div className="track-waveform" aria-hidden="true">
        {waveBars.map((height, barIndex) => (
          <span key={barIndex} style={{ height: `${height}%` }} />
        ))}
      </div>

      <p className="track-note">{track.note}</p>

      <div className="track-controls">
        <button
          onClick={() => onTogglePlay(!isPlaying)}
          className="track-play-button"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </button>

        <div className="track-timeline">
          <div className="track-scrubber" onClick={handleSeek}>
            <div className="track-progress" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="track-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </article>
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
