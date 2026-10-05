import React from 'react';
import { Layers, Drum, Music2, Cpu, FileAudio, Sliders, Disc, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Layers,
    title: 'Multi-Track Polyphony',
    desc: 'Melody, harmony, bass, and rhythm channels execute in concurrent tracks and mix into a single coherent audio stream.'
  },
  {
    icon: Music2,
    title: 'Procedural Instruments',
    desc: 'Synthesizes acoustic piano, organ, strings, flute, brass, guitar, and synth bass from scratch. Zero sample library overhead.'
  },
  {
    icon: Drum,
    title: '16-Piece Drum Machine',
    desc: 'Synthesized kick, snare, hi-hats, toms, crash, and clap with 5 distinct acoustic and vintage drum kits.'
  },
  {
    icon: Sparkles,
    title: '9 Retro & Modern Sound Eras',
    desc: 'Switch between 4-bit vintage microchips, 8-bit NES, 16-bit SNES SPC700, Amiga tracker, FM synthesis, and 32-bit float.'
  },
  {
    icon: FileAudio,
    title: 'Native Audio Export',
    desc: 'Zero-dependency export to WAV, MIDI, and AIFF. Optional FLAC, MP3, and OGG encoding when FFmpeg is present.'
  },
  {
    icon: Cpu,
    title: 'Zero Dependencies',
    desc: 'Self-contained architecture with zero external audio frameworks. No JUCE, SDL, or PortAudio runtime bloat.'
  },
  {
    icon: Sliders,
    title: 'Built-in Spatial DSP',
    desc: 'Native room reverberation and tempo-synced stereo echo delay controllable directly via single script directives.'
  },
  {
    icon: Disc,
    title: 'Studio Mastering Presets',
    desc: 'Directives for target sample rates: streaming (48 kHz/24-bit), cd (44.1 kHz/16-bit), and hires (96 kHz/24-bit audiophile).'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Engineered for sonic precision.
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl">
            A complete synthesis pipeline packaged into an expressive domain-specific language.
          </p>
        </div>

        {/* Bento Grid — horizontally swipeable on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-px bg-transparent sm:bg-white/[0.08] rounded-xl sm:overflow-hidden sm:border border-white/[0.08] snap-x snap-mandatory">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i} 
                className="min-w-[270px] sm:min-w-0 flex-shrink-0 snap-start p-6 bg-[#0a0a0a] hover:bg-[#0f0f0f] border border-white/[0.08] sm:border-0 rounded-xl sm:rounded-none transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-neutral-400 group-hover:text-white group-hover:border-white/[0.15] flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2 tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
