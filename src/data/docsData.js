export const DOCS_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    category: 'Overview',
    description: 'Lyra is a minimal, declarative domain-specific music programming language written in pure C++17.',
    content: `
### What is Lyra?
Lyra treats musical pieces as structured code. Instead of heavy DAWs, you write readable text files ending in \`.lyra\` and compile them straight into high-fidelity uncompressed **WAV**, raw **MIDI**, **AIFF**, event **JSON**, or compressed streaming files (**FLAC**, **MP3**, **OGG**).

### Key Highlights
- **Zero Runtime Dependencies**: The core compiler & synthesis engine are self-contained pure C++17.
- **Microsecond compilation**: Instant rendering to 24-bit 48kHz / 96kHz PCM stereo audio.
- **Multi-Track Engine**: Parallel execution of melody, bass, chords, and rhythmic drum channels.
- **Sound Modes & Nostalgia**: Authentic retro emulations from 4-bit and 8-bit chiptune to warm 16-bit chorus, Amiga trackers, and clean modern studio output.
    `
  },
  {
    id: 'syntax-guide',
    title: 'Syntax & Primitives',
    category: 'Language Reference',
    description: 'Everything you need to write tracks, chords, notes, loops, and tempos.',
    table: [
      { cmd: 'tempo <bpm>', desc: 'Sets global playback speed in beats per minute', example: 'tempo 128' },
      { cmd: 'volume <0-100>', desc: 'Master or track-scoped volume level', example: 'volume 80' },
      { cmd: 'wave <type>', desc: 'Waveform oscillator: sine, square, triangle, saw, pulse, noise', example: 'wave pulse' },
      { cmd: 'note <pitch> <beats>', desc: 'Triggers a single pitch with beat duration (octaves 0-8)', example: 'note C#4 0.5' },
      { cmd: 'rest <beats>', desc: 'Rest / pause silence for duration in beats', example: 'rest 1.0' },
      { cmd: 'chord <n...> <beats>', desc: 'Plays multiple polyphonic notes simultaneously', example: 'chord C4 E4 G4 B4 2' },
      { cmd: 'track <name> { ... }', desc: 'Isolates an independent parallel audio track', example: 'track melody { ... }' },
      { cmd: 'loop <n> { ... }', desc: 'Repeats a musical block n times', example: 'loop 4 { kick 0.5 }' }
    ]
  },
  {
    id: 'percussion-drums',
    title: 'Drums & Percussion',
    category: 'Language Reference',
    description: 'Dedicated drum synthesis without external sample libraries.',
    content: `
Lyra has built-in procedural synthesis models for 16 distinct percussion instruments:
- \`kick\` — deep resonant punch with exponential pitch envelope
- \`snare\` — dual-layer snap with noise burst and body oscillation
- \`hihat\` & \`openhat\` — metallic frequency band noise hats
- \`clap\` — multi-trigger rhythmic handclap
- \`tom\`, \`low_tom\`, \`high_tom\` — tuned acoustic tom fills
- \`crash\` & \`ride\` — shimmering metallic cymbal tails
- \`rimshot\`, \`cowbell\`, \`shaker\`, \`tambourine\`, \`timpani\`, \`impact\`

\`\`\`lyra
track drums {
  drumkit rock
  volume 85

  loop 4 {
    kick 0.5
    hihat 0.25
    hihat 0.25
    snare 0.5
    hihat 0.5
  }
}
\`\`\`
    `
  },
  {
    id: 'sound-modes',
    title: 'Sound Modes & Eras',
    category: 'Synthesis & FX',
    description: 'Switch between historic console audio chips and modern studio mastering.',
    content: `
Use \`sound <mode>\` to alter the global DSP character:
- **\`4bit\`**: Early vintage microcomputer sound (handhelds, calculator chips).
- **\`8bit\`**: Classic NES / Game Boy style pulse-width & noise grit.
- **\`16bit\`**: Warm SNES / Genesis era chorus and sample depth.
- **\`32bit\` & \`64bit\`**: Mid-90s CD audio & cartridge consoles.
- **\`tracker\`**: Classic Amiga Paula chip step-interpolation feel.
- **\`fm\`**: 2-op / 4-op phase modulation synth for crisp metallic timbres.
- **\`chiptune_modern\`**: Modern high-fidelity electronic hybrid.
- **\`modern\`**: Crystal clean 32-bit floating-point mastering.

Mastering presets:
\`\`\`lyra
master streaming   # Stereo 48 kHz / 24-bit PCM, -1 dB peak limit
master cd          # Stereo 44.1 kHz / 16-bit
master hires       # Stereo 96 kHz / 24-bit audiophile quality
reverb 25          # Space reflection diffusion (0-100)
delay 0.75 20      # Tempo-synced delay (beats, feedback%)
\`\`\`
    `
  },
  {
    id: 'cli-usage',
    title: 'CLI & Compiler Commands',
    category: 'Tooling',
    description: 'Compile, check, export, and automate Lyra projects from terminal.',
    commands: [
      { cmd: 'lyra song.lyra', desc: 'Compiles and renders song.lyra directly to song.wav' },
      { cmd: 'lyra run song.lyra output.wav', desc: 'Renders to an explicit output filename' },
      { cmd: 'lyra check song.lyra', desc: 'Fast syntax validation and linter without synthesis' },
      { cmd: 'lyra init my_song.lyra', desc: 'Scaffolds a new Lyra project template with tracks' },
      { cmd: 'lyra test', desc: 'Recursively runs test suites across your project' },
      { cmd: 'lyra -f midi song.lyra', desc: 'Exports standard MIDI file (.mid)' },
      { cmd: 'lyra -f json song.lyra', desc: 'Exports structured JSON note event stream' },
      { cmd: 'lyra -f flac song.lyra', desc: 'Lossless FLAC compression (via FFmpeg)' },
      { cmd: 'lyra -f mp3 song.lyra', desc: 'Lossy MP3 encoding (via FFmpeg)' }
    ]
  },
  {
    id: 'architecture',
    title: 'Compiler Architecture',
    category: 'Under the Hood',
    description: 'How Lyra transforms human-readable text into audio waveforms.',
    pipeline: [
      { step: '01', name: 'Source Lexing', detail: 'Tokenizes commands, parameters, chords, and track scopes.' },
      { step: '02', name: 'AST & Event Graph', detail: 'Converts tracks, loops, and math expressions into scheduled NoteEvent timeline.' },
      { step: '03', name: 'Polyphonic DSP Synth', detail: 'Renders waveforms, ADSR envelopes, filters, and drum synthesizers at 44.1/48/96 kHz.' },
      { step: '04', name: 'Mastering & Export', detail: 'Applies reverb, delay, normalization, WAV INFO metadata, and writes output files.' }
    ]
  }
];

export const INSTALLER_SPECS = {
  version: '1.0.0',
  lyraVersion: '3.0.0',
  releaseTag: 'v1.0.0',
  date: 'Latest Release',
  downloadUrl: 'https://github.com/tomokuroki/Lyra-Installer/releases/download/v1.0.0/lyra-1.0.0.exe',
  githubInstallerRepo: 'https://github.com/tomokuroki/Lyra-Installer',
  githubLyraRepo: 'https://github.com/tomokuroki/lyra',
  fileSize: '3.04 MB (3,191,808 bytes)',
  fileName: 'lyra-1.0.0.exe',
  os: 'Windows 10 / 11 (x64)',
  sha256: '4c73bf1cf6e5f1dd7b7fcdff3326db634c36aeed58c0d0c74e01e7fde7a8a60e',
  highlights: [
    { title: 'Self-Contained', desc: 'No Git, CMake, Python, or C++ compiler required on your system.' },
    { title: 'User PATH Integration', desc: 'Instantly type "lyra" anywhere in Command Prompt or PowerShell.' },
    { title: '.lyra File Association', desc: 'Double click .lyra files to inspect, compile, or open them.' },
    { title: 'Bundled Standard Library', desc: 'Includes full stdlib, sound era presets, and starter tracks.' },
    { title: 'Zero Admin Privileges', desc: 'Installs per-user without requiring UAC administrator prompts.' },
    { title: 'Clean Uninstaller', desc: 'Registers cleanly in Windows Installed Apps for single-click removal.' }
  ]
};
