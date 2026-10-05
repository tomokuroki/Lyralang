import React, { useState } from 'react';
import { Download, Play, Square, Copy, Check, Terminal, ExternalLink, ChevronRight, Volume2 } from 'lucide-react';
import { INSTALLER_SPECS } from '../data/docsData';
import { parse, render } from '../engine/lyraEngine';

const CODE_PRESETS = [
  {
    id: 'symphony',
    name: 'symphony.lyra',
    code: `tempo 128
volume 85
sound 16bit

track melody {
  wave pulse
  reverb 25

  note C4 0.5
  note E4 0.5
  note G4 1.0
  chord C4 E4 G4 B4 2.0
}

track drums {
  loop 4 {
    kick 0.5
    snare 0.5
    hihat 0.25
    hihat 0.25
  }
}`
  },
  {
    id: 'retro',
    name: 'gameboy.lyra',
    code: `tempo 140
sound 8bit

track lead {
  wave pulse
  note E4 0.25
  note G4 0.25
  note B4 0.25
  note E5 0.5
}

track bass {
  wave triangle
  note E2 0.5
  note B2 0.5
}`
  },
  {
    id: 'chords',
    name: 'harmony.lyra',
    code: `tempo 96
master cd

track piano {
  instrument strings
  reverb 40
  chord C4 E4 G4 2.0
  chord F4 A4 C5 2.0
  chord G4 B4 D5 2.0
}`
  }
];

function highlightCode(code) {
  const lines = code.split('\n');
  const KEYWORDS = /^(tempo|volume|wave|track|note|rest|chord|loop|kick|snare|hihat|instrument|sound|reverb|delay|master)/;
  const WAVE = /\b(pulse|sine|square|triangle|saw|noise)\b/;
  const NOTE = /\b([A-G][#b]?\d)\b/;
  const NUM = /\b(\d+\.?\d*)\b/;
  const COMMENT = /^(#.*)/;

  return lines.map((line, idx) => {
    if (COMMENT.test(line.trim())) {
      return (
        <div key={idx} className="flex">
          <span className="w-8 shrink-0 text-neutral-600 text-right pr-4 select-none text-xs">{idx + 1}</span>
          <span className="text-neutral-500 font-mono text-xs">{line}</span>
        </div>
      );
    }

    const indentMatch = line.match(/^(\s+)/);
    const indent = indentMatch ? indentMatch[1] : '';
    const content = line.slice(indent.length);

    const tokens = content.split(/(\s+|[{}])/);
    const renderedTokens = tokens.map((tok, tIdx) => {
      if (!tok) return null;
      if (/^[{}]$/.test(tok)) return <span key={tIdx} className="text-neutral-500">{tok}</span>;
      if (KEYWORDS.test(tok)) return <span key={tIdx} className="text-sky-400 font-medium">{tok}</span>;
      if (WAVE.test(tok)) return <span key={tIdx} className="text-purple-400">{tok}</span>;
      if (NOTE.test(tok)) return <span key={tIdx} className="text-amber-300 font-semibold">{tok}</span>;
      if (NUM.test(tok) && /^\d/.test(tok)) return <span key={tIdx} className="text-emerald-400">{tok}</span>;
      return <span key={tIdx} className="text-neutral-300">{tok}</span>;
    });

    return (
      <div key={idx} className="flex hover:bg-white/[0.02] transition-colors">
        <span className="w-8 shrink-0 text-neutral-600 text-right pr-4 select-none text-xs leading-6">{idx + 1}</span>
        <span className="font-mono text-xs leading-6 whitespace-pre">{indent}{renderedTokens}</span>
      </div>
    );
  });
}

export default function Hero({ onScrollToPlayground, onScrollToInstaller, onOpenDocs }) {
  const [activeTab, setActiveTab] = useState(CODE_PRESETS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const audioContextRef = React.useRef(null);
  const audioSourceRef = React.useRef(null);

  const copyCliCommand = () => {
    navigator.clipboard.writeText('lyra symphony.lyra');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 1500);
  };

  const stopAudio = () => {
    try {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }
    } catch {}
    setIsPlaying(false);
  };

  const playPresetAudio = () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    try {
      const parsed = parse(activeTab.code);
      const rendered = render(parsed);
      if (!rendered || !rendered.samples.length) return;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const ctx = audioContextRef.current;
      const buf = ctx.createBuffer(1, rendered.samples.length, rendered.sampleRate);
      buf.getChannelData(0).set(rendered.samples);

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.onended = () => {
        setIsPlaying(false);
        audioSourceRef.current = null;
      };
      src.start();
      audioSourceRef.current = src;
      setIsPlaying(true);
    } catch (e) {
      console.error(e);
      onScrollToPlayground();
    }
  };

  return (
    <section id="overview" className="pt-32 pb-24 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero headline with official logo */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo-mark.svg" alt="Lyra" className="w-9 h-9 object-contain" />
            <div className="h-4 w-px bg-white/[0.1]" />
            <span className="text-xs font-mono text-neutral-400">
              Music Programming Language
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6">
            The music programming language.
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed font-normal">
            Built to compose, synthesize, and export audio entirely from code.
            Zero external dependencies, instant compilation to 24-bit master WAV and MIDI.
          </p>
        </div>

        {/* Action buttons + copy snippet */}
        <div className="flex flex-wrap items-center gap-3 mb-14">
          <button
            onClick={onScrollToInstaller}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-white hover:bg-neutral-200 text-black transition-all active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download for Windows</span>
            <span className="text-[11px] font-mono text-neutral-500 ml-1">v1.0.0</span>
          </button>

          <button
            onClick={onScrollToPlayground}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/[0.08] hover:border-white/[0.15] transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Open Web Studio</span>
          </button>

          {/* Copyable CLI pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-950 border border-white/[0.08] text-xs font-mono text-neutral-400">
            <span className="text-neutral-600">$</span>
            <span>lyra symphony.lyra</span>
            <button
              onClick={copyCliCommand}
              className="text-neutral-500 hover:text-white transition-colors ml-1 p-0.5"
              title="Copy command"
            >
              {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Cursor-like IDE Code Showcase Window */}
        <div className="rounded-xl border border-white/[0.1] bg-[#0c0c0c] overflow-hidden shadow-2xl">
          {/* Top window bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#080808]">
            <div className="flex items-center gap-4">
              {/* Traffic dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1">
                {CODE_PRESETS.map((preset) => {
                  const isActive = activeTab.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        stopAudio();
                        setActiveTab(preset);
                      }}
                      className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                        isActive
                          ? 'bg-white/[0.08] text-white font-medium border border-white/[0.08]'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action in title bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={playPresetAudio}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                  isPlaying
                    ? 'bg-amber-400 text-black font-semibold'
                    : 'bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 border border-white/[0.08]'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current text-emerald-400" />
                    <span>Play Audio</span>
                  </>
                )}
              </button>

              <button
                onClick={onScrollToPlayground}
                className="hidden sm:flex items-center gap-1 text-xs font-mono text-neutral-500 hover:text-neutral-300 px-2 py-1 transition-colors"
              >
                <span>Edit in Studio</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Code Window Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Editor Pane */}
            <div className="lg:col-span-8 p-5 font-mono text-xs overflow-x-auto border-b lg:border-b-0 lg:border-r border-white/[0.06] bg-[#0a0a0a]">
              {highlightCode(activeTab.code)}
            </div>

            {/* Side Terminal / Compilation details */}
            <div className="lg:col-span-4 p-5 font-mono text-xs bg-[#080808] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-neutral-500 mb-3 text-[11px] uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Deterministic Compiler Pipeline</span>
                </div>
                <div className="space-y-1.5 text-neutral-400 text-xs">
                  <div><span className="text-neutral-600">$</span> lyra {activeTab.name}</div>
                  <div className="text-neutral-500 pl-3">↳ Lexer: 0 errors</div>
                  <div className="text-neutral-500 pl-3">↳ Timeline: resolved</div>
                  <div className="text-neutral-500 pl-3">↳ DSP: 48,000 Hz / 24-bit</div>
                  <div className="text-emerald-400 pl-3">✓ Finished output.wav</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-2">
                <div className="text-[11px] text-neutral-500">
                  Lyra runs standalone with zero third-party audio libraries.
                </div>
                <button
                  onClick={onScrollToPlayground}
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-neutral-300 flex items-center justify-between transition-colors"
                >
                  <span>Open full playground</span>
                  <ChevronRight className="w-3 h-3 text-neutral-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
