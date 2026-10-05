export const EXAMPLES = [
  {
    id: 'intro',
    title: 'Hello Lyra',
    tag: 'Chiptune Arp',
    tempo: 120,
    code: `tempo 120
volume 85

track melody {
  wave pulse
  volume 80

  note C4 0.5
  note E4 0.5
  note G4 0.5
  note B4 0.5
  note C5 1
  rest 0.5
  note G4 0.5
}

track bass {
  wave triangle
  volume 65

  note C3 2
  note G2 2
}`
  },
  {
    id: 'cyberpunk',
    title: 'Neon Highway',
    tag: 'Synthwave / FM',
    tempo: 130,
    code: `tempo 130
volume 82

track lead {
  wave pulse
  volume 78

  loop 2 {
    note E4 0.5
    note G4 0.5
    note A4 0.5
    note B4 0.5
    note D5 0.5
    note B4 0.5
    note A4 1
  }
}

track bassline {
  wave saw
  volume 60

  loop 4 {
    note E2 0.5
    note E2 0.5
    note G2 0.5
    note A2 0.5
  }
}

track beat {
  volume 75

  loop 4 {
    kick 0.5
    hihat 0.25
    hihat 0.25
    snare 0.5
    hihat 0.5
  }
}`
  },
  {
    id: 'chords',
    title: 'Atmospheric Chords',
    tag: 'Harmonic Ambient',
    tempo: 96,
    code: `tempo 96
volume 75

track pads {
  wave sine
  volume 60

  chord C4 E4 G4 2
  chord A3 C4 E4 2
  chord F3 A3 C4 2
  chord G3 B3 D4 2
}

track bells {
  wave triangle
  volume 70

  rest 1
  note E5 1
  note G5 1
  note A5 1
  note G5 1
  note F5 1
  note E5 1
  note C5 1
}`
  },
  {
    id: 'breakbeat',
    title: 'Breakbeat Groove',
    tag: 'Tracker 90s',
    tempo: 140,
    code: `tempo 140
volume 85

track drums {
  volume 80

  loop 4 {
    kick 0.5
    hihat 0.25
    hihat 0.25
    snare 0.5
    kick 0.25
    kick 0.25
    snare 0.5
    hihat 0.5
  }
}

track bass {
  wave square
  volume 70

  loop 2 {
    note A2 1
    note C3 1
    note D3 0.5
    note D#3 0.5
    note D3 1
  }
}`
  },
  {
    id: 'bossBattle',
    title: 'JRPG Dungeon',
    tag: '16-Bit Battle',
    tempo: 150,
    code: `tempo 150
volume 80

track theme {
  wave pulse
  volume 75

  loop 2 {
    note D4 0.25
    note D4 0.25
    note D5 0.5
    note A4 0.5
    note G#4 0.5
    note G4 0.5
    note F4 0.5
    note D4 0.5
    note F4 0.5
  }
}

track backing {
  wave triangle
  volume 60

  loop 4 {
    note D3 0.5
    note A2 0.5
    note D3 0.5
    note F3 0.5
  }
}

track percussion {
  volume 70

  loop 4 {
    kick 0.5
    hihat 0.25
    snare 0.5
    hihat 0.25
    snare 0.5
  }
}`
  }
];
