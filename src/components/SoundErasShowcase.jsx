import React, { useState } from 'react';
import { Layers, ChevronRight, Copy, Check } from 'lucide-react';

const ERAS = [
  { id: '4bit',            name: '4-bit Microchip',  era: 'c. 1977',  chip: 'Early discrete DACs',  snippet: 'sound 4bit\nwave pulse\n\nnote C4 0.5\nnote E4 0.5\nnote G4 1.0' },
  { id: '8bit',            name: '8-bit Console',    era: '1983–89',  chip: 'NES 2A03 / Game Boy', snippet: 'sound 8bit\n\ntrack melody {\n  wave pulse\n  note C4 0.5\n  note G4 0.5\n}\n\ntrack bass {\n  wave triangle\n  note C2 1.0\n}' },
  { id: '16bit',           name: '16-bit Era',       era: '1990–95',  chip: 'SNES SPC700',         snippet: 'sound 16bit\ninstrument strings\nreverb 30\n\nchord C4 E4 G4 2.0\nchord F4 A4 C5 2.0' },
  { id: '32bit',           name: '32-bit PCM',       era: '1994–97',  chip: 'Red Book CD-Audio',   snippet: 'sound 32bit\ndrumkit electronic\nmaster cd\n\nloop 2 {\n  kick 0.5\n  snare 0.5\n}' },
  { id: '64bit',           name: '64-bit Audio',     era: '1996–02',  chip: 'Reality Signal DSP',  snippet: 'sound 64bit\ninstrument flute\nreverb 50\ndelay 0.75 30\n\nnote D4 1.5' },
  { id: 'tracker',         name: 'Tracker Sound',    era: '1987–93',  chip: 'Amiga Paula 8364',    snippet: 'sound tracker\ntempo 138\n\ntrack beat {\n  loop 4 {\n    kick 0.5\n    snare 0.5\n  }\n}' },
  { id: 'fm',              name: 'FM Synthesis',     era: '1980s',    chip: 'Yamaha OPN2 / DX7',   snippet: 'sound fm\ninstrument electric_piano\n\nchord E3 B3 G4 2.0\nchord A3 C4 E4 2.0' },
  { id: 'chiptune_modern', name: 'Modern Chiptune',  era: 'Present',  chip: 'Hybrid Vintage DSP',  snippet: 'sound chiptune_modern\nwave pulse\nvolume 85\n\nnote A4 0.25\nnote C5 0.25\nnote E5 0.5' },
  { id: 'modern',          name: 'Clean Studio',     era: 'Present',  chip: '32-bit Float Hi-Res', snippet: 'sound modern\nmaster hires\npeak -1.0\n\ntrack lead {\n  wave sine\n  note C4 2.0\n}' }
];

export default function SoundErasShowcase() {
  const [selected, setSelected] = useState(ERAS[1]);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(selected.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="sound-modes" className="py-24 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Nine sound eras in one keyword.
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl">
            Switch from crunch 4-bit arcade DACs to 32-bit floating point mastering simply by changing the <code className="text-neutral-200 font-mono text-xs">sound</code> directive.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* List of Eras — horizontally scrollable on mobile, column on desktop */}
          <div className="lg:col-span-5 rounded-xl border border-white/[0.08] bg-[#0c0c0c] p-1.5 flex overflow-x-auto lg:flex-col gap-1 lg:gap-0 lg:space-y-0.5 snap-x">
            {ERAS.map((era) => {
              const active = selected.id === era.id;
              return (
                <button
                  key={era.id}
                  onClick={() => setSelected(era)}
                  className={`shrink-0 lg:w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between gap-3 text-xs transition-colors snap-start ${
                    active
                      ? 'bg-white/[0.08] text-white font-medium border border-white/[0.08]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-amber-400' : 'bg-neutral-700'}`} />
                    <span className="whitespace-nowrap">{era.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500 whitespace-nowrap">{era.era}</span>
                </button>
              );
            })}
          </div>

          {/* Code & Era Detail Pane */}
          <div className="lg:col-span-7 rounded-xl border border-white/[0.1] bg-[#0c0c0c] overflow-hidden flex flex-col justify-between shadow-2xl">
            <div>
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-white/[0.06] bg-[#080808] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white tracking-tight">{selected.name}</div>
                  <div className="text-[11px] font-mono text-neutral-500 mt-0.5">Emulated chip: {selected.chip}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-neutral-300">
                    sound {selected.id}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-1 rounded text-neutral-500 hover:text-white transition-colors"
                    title="Copy snippet"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Code */}
              <div className="p-5 font-mono text-xs text-neutral-300 leading-relaxed whitespace-pre bg-[#0a0a0a]">
                {selected.snippet}
              </div>
            </div>

            <div className="p-4 border-t border-white/[0.06] bg-[#080808] text-xs font-mono text-neutral-500 flex items-center justify-between">
              <span>All 9 modes synthesized procedurally at runtime</span>
              <span className="text-neutral-400">Zero sample packs</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
