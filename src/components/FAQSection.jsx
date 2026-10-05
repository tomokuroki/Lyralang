import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Do I need a C++ compiler or CMake installed to use Lyra?',
    a: 'No. The pre-packaged Windows installer (lyra-1.0.0.exe) ships the standalone pre-compiled x64 binary. You can download and start writing scores immediately without toolchain configuration.'
  },
  {
    q: 'Does installing Lyra require Administrator privileges?',
    a: 'No. The installer operates on a per-user scope without UAC elevation prompts. It sets up files in your local AppData directory and adds Lyra to your user-level PATH environment variable.'
  },
  {
    q: 'How does Lyra produce audio without audio sample packs or SoundFonts?',
    a: 'Lyra uses procedural DSP algorithms implemented in C++17. Waveforms (sine, pulse, triangle, saw, white/pink noise), acoustic instruments, and drums are synthesized mathematically on each sample tick at runtime.'
  },
  {
    q: 'Which audio file formats are supported natively?',
    a: 'WAV (16-bit, 24-bit PCM), Standard MIDI files (type 0/1), and AIFF are built-in with zero dependencies. If FFmpeg is installed on your system, Lyra can also encode to FLAC, MP3, and OGG Vorbis.'
  },
  {
    q: 'Under what license is Lyra distributed?',
    a: 'Lyra is distributed under the Software License Agreement Version 1.0 (Copyright 2026 tomokuroki and contributors). It grants nonexclusive royalty-free rights to use, test, perform, and create derivative works.'
  }
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-24 border-b border-white/[0.08]">
      <div className="max-w-3xl mx-auto px-6">
        
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-white/[0.08] bg-[#0c0c0c] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-xs sm:text-sm font-medium text-neutral-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-white/[0.04]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
