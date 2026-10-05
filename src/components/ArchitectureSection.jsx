import React from 'react';
import { ExternalLink, Terminal, ArrowRight } from 'lucide-react';
import { INSTALLER_SPECS } from '../data/docsData';

const STAGES = [
  {
    step: '01',
    name: 'Lexer & Tokenizer',
    file: 'src/frontend.cpp',
    summary: 'Converts raw UTF-8 script tokens into typed AST nodes, tracking row and column offsets for descriptive diagnostics.'
  },
  {
    step: '02',
    name: 'Timeline Parser',
    file: 'src/parser.cpp',
    summary: 'Evaluates duration arithmetic, expands loops, resolves track scopes, and constructs an ordered NoteEvent chronological stream.'
  },
  {
    step: '03',
    name: 'DSP Synthesizer',
    file: 'src/synth.cpp',
    summary: 'Renders sample buffers in real-time. Computes waveforms, ADSR envelopes, drum physics, and stereo panning.'
  },
  {
    step: '04',
    name: 'Audio Exporter',
    file: 'src/export.cpp',
    summary: 'Mixes multi-track channels, applies spatial reverb/delay, normalizes headroom, and writes 24-bit RIFF WAV or Standard MIDI.'
  }
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Deterministic Compiler Pipeline
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl">
            Clean 4-stage pipeline. Text score in, bit-exact studio master audio out.
          </p>
        </div>

        {/* 4 Pipeline cards — swipeable on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-px bg-transparent sm:bg-white/[0.08] rounded-xl sm:overflow-hidden sm:border border-white/[0.08] snap-x snap-mandatory">
          {STAGES.map((stage) => (
            <div
              key={stage.step}
              className="min-w-[260px] sm:min-w-0 flex-shrink-0 snap-start p-6 bg-[#0a0a0a] hover:bg-[#0f0f0f] border border-white/[0.08] sm:border-0 rounded-xl sm:rounded-none transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="text-2xl font-mono font-bold text-neutral-600 mb-4 group-hover:text-neutral-400 transition-colors">
                  {stage.step}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 tracking-tight">
                  {stage.name}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal mb-6">
                  {stage.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.04]">
                <a
                  href={`${INSTALLER_SPECS.githubLyraRepo}/blob/main/${stage.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
                >
                  <span>{stage.file}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-600 group-hover:text-neutral-300" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
