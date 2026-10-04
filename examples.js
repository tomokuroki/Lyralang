window.LYRA_EXAMPLES = {
  intro: `tempo 120

track melody {
  wave pulse
  volume 82

  note C4 0.5
  note E4 0.5
  note G4 1
  note C5 1
}

track bass {
  wave triangle
  volume 42

  note C3 2
  note G2 2
}`,

  chords: `tempo 96
volume 72

track harmony {
  wave sine
  volume 54

  chord C4 E4 G4 2
  chord A3 C4 E4 2
  chord F3 A3 C4 2
  chord G3 B3 D4 2
}

track melody {
  wave triangle
  volume 70

  note E5 1
  note G5 1
  note A5 1
  note G5 1
  note F5 1
  note E5 1
  note D5 1
  note C5 1
}`,

  drums: `tempo 132
volume 74

track drums {
  volume 66

  loop 4 {
    kick 0.5
    hihat 0.25
    hihat 0.25
    snare 0.5
    hihat 0.5
  }
}

track bass {
  wave square
  volume 40

  loop 2 {
    note C2 1
    note G2 1
    note A#2 1
    note G2 1
  }
}`,

  multi: `tempo 144
volume 74

track lead {
  wave pulse
  volume 80

  loop 2 {
    note A4 0.25
    note C5 0.25
    note E5 0.5
    note G5 0.5
    note E5 0.25
    note C5 0.25
  }
}

track bass {
  wave square
  volume 38

  loop 2 {
    note A2 1
    note E3 1
  }
}

track drums {
  volume 54

  loop 4 {
    kick 0.5
    hihat 0.25
    hihat 0.25
    snare 0.5
    hihat 0.5
  }
}`
};