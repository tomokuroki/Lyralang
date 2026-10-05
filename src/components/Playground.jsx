import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Download, Upload, Copy, Check, AlertCircle, FileText, ChevronRight, Terminal, RefreshCw } from 'lucide-react';
import { EXAMPLES } from '../data/examples';
import { parse, render, wavBlob } from '../engine/lyraEngine';
import AudioVisualizer from './AudioVisualizer';

export default function Playground() {
  const [activePreset, setActivePreset] = useState(EXAMPLES[0].id);
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [status, setStatus] = useState('idle'); // idle | playing
  const [errorMsg, setErrorMsg] = useState(null);
  const [stats, setStats] = useState({ tempo: 120, events: 0, duration: '0:00', tracks: 0 });
  const [copied, setCopied] = useState(false);

  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const fileInputRef = useRef(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const compileCode = (sourceText) => {
    try {
      const parsed = parse(sourceText);
      const rendered = render(parsed);
      setErrorMsg(null);
      const sec = Math.floor(rendered?.durationSec || 0);
      const eventCount = parsed?.events?.length || 0;
      const trackCount = parsed?.events ? new Set(parsed.events.map(e => e.track || 'main')).size : 1;
      setStats({
        tempo: parsed?.config?.tempo || 120,
        events: eventCount,
        duration: `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`,
        tracks: trackCount
      });
      return rendered;
    } catch (err) {
      setErrorMsg(err.message);
      return null;
    }
  };

  useEffect(() => {
    const t = setTimeout(() => compileCode(code), 150);
    return () => clearTimeout(t);
  }, [code]);

  const stopPlayback = () => {
    try {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
    } catch {}
    setStatus('idle');
  };

  const startPlayback = async () => {
    stopPlayback();
    const rendered = compileCode(code);
    if (!rendered || !rendered.samples.length) return;

    const ctx = getAudioContext();
    const buf = ctx.createBuffer(1, rendered.samples.length, rendered.sampleRate);
    buf.getChannelData(0).set(rendered.samples);

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(analyserRef.current);
    analyserRef.current.connect(ctx.destination);

    src.onended = () => {
      sourceRef.current = null;
      setStatus('idle');
    };

    src.start();
    sourceRef.current = src;
    setStatus('playing');
  };

  const exportWavFile = () => {
    const rendered = compileCode(code);
    if (!rendered || !rendered.samples.length) return;
    const blob = wavBlob(rendered);
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `${activePreset}.wav`
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        stopPlayback();
        setActivePreset('custom');
        setCode(ev.target.result);
      }
    };
    reader.readAsText(file);
  };

  const lines = code.split('\n');

  return (
    <section id="playground" className="py-24 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Web Audio Studio
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl">
            Edit scores in real time. The Lyra synthesis engine runs locally in your browser using WebAudio with zero latency.
          </p>
        </div>

        {/* IDE Container */}
        <div className="rounded-xl border border-white/[0.1] bg-[#0c0c0c] overflow-hidden shadow-2xl">
          
          {/* Top Bar with File Tabs */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-[#080808] overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {EXAMPLES.map((ex) => {
                const isActive = activePreset === ex.id;
                return (
                  <button
                    key={ex.id}
                    onClick={() => {
                      stopPlayback();
                      setActivePreset(ex.id);
                      setCode(ex.code);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors shrink-0 ${
                      isActive
                        ? 'bg-white/[0.08] text-white font-medium border border-white/[0.08]'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <FileText className="w-3 h-3 text-neutral-600" />
                    <span>{ex.id}.lyra</span>
                  </button>
                );
              })}

              <input
                ref={fileInputRef}
                type="file"
                accept=".lyra,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-300 rounded transition-colors"
                title="Open local file"
              >
                <Upload className="w-3 h-3" />
                <span>Open...</span>
              </button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-neutral-400 hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition-colors"
                title="Copy script"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Editor Area with Line Numbers */}
          <div className="relative flex bg-[#0a0a0a] min-h-[380px] max-h-[500px]">
            {/* Line numbers gutter */}
            <div className="w-12 py-4 select-none text-right pr-3 font-mono text-xs text-neutral-700 bg-[#080808] border-r border-white/[0.04]">
              {lines.map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>

            {/* Editable code text area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-4 bg-transparent font-mono text-xs text-neutral-200 outline-none resize-none leading-6 overflow-y-auto selection:bg-white/20"
            />
          </div>

          {/* Error banner if syntax is invalid */}
          {errorMsg && (
            <div className="px-4 py-2 border-t border-rose-900/50 bg-rose-950/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Bottom Studio Bar (Oscilloscope, Status, Play/Stop, Export) */}
          <div className="border-t border-white/[0.06] bg-[#080808] px-4 py-3 flex flex-wrap items-center justify-between gap-4">
            
            {/* Controls */}
            <div className="flex items-center gap-3">
              {status === 'playing' ? (
                <button
                  onClick={stopPlayback}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-mono font-medium bg-neutral-800 hover:bg-neutral-700 text-white border border-white/[0.1] transition-all"
                >
                  <Square className="w-3 h-3 fill-current text-amber-400" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={startPlayback}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-mono font-medium bg-white hover:bg-neutral-200 text-black transition-all active:scale-95"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run Score</span>
                </button>
              )}

              <button
                onClick={exportWavFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-neutral-400 hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Export .wav</span>
              </button>

              <div className="h-4 w-px bg-white/[0.08] hidden sm:block" />

              {/* Status info */}
              <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-neutral-500">
                <span>Tempo: <strong className="text-neutral-300">{stats.tempo} BPM</strong></span>
                <span>Events: <strong className="text-neutral-300">{stats.events}</strong></span>
                <span>Tracks: <strong className="text-neutral-300">{stats.tracks}</strong></span>
                <span>Duration: <strong className="text-neutral-300">{stats.duration}</strong></span>
              </div>
            </div>

            {/* Mini Oscilloscope */}
            <div className="w-36 h-7 rounded border border-white/[0.06] overflow-hidden bg-black shrink-0">
              <AudioVisualizer isPlaying={status === 'playing'} analyserNode={analyserRef.current} />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
