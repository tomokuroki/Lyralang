import React from 'react';
import { Download } from 'lucide-react';

export default function Hero({ onScrollToInstaller }) {
  return (
    <section id="overview" className="pt-32 pb-24 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="hero-intro">
          <div className="hero-copy">
            <div className="max-w-3xl mb-8">
              <h1 className="text-white">Build sound</h1>
              <p>
                Compose, synthesize, and export audio entirely from code. Zero external dependencies, instant compilation to 24-bit master WAV and MIDI.
              </p>
            </div>

            <div className="hero-actions">
              <button onClick={onScrollToInstaller}>
                <Download className="w-3.5 h-3.5" />
                <span>Download Lyra</span>
                <span className="text-[11px] font-mono">v1.0.0</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
