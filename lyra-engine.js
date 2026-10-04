(function (global) {
  "use strict";

  const PI = 3.14159265358979323846;
  const DEFAULT_SAMPLE_RATE = 44100;

  const noteMap = {
    c:0, "c#":1, db:1, d:2, "d#":3, eb:3, e:4, f:5,
    "f#":6, gb:6, g:7, "g#":8, ab:8, a:9, "a#":10, bb:10, b:11
  };

  const waveAliases = {
    sine:"sine", sin:"sine",
    square:"square", sq:"square",
    triangle:"triangle", tri:"triangle",
    saw:"saw", sawtooth:"saw",
    pulse:"pulse", noise:"noise"
  };

  function stripComment(raw) {
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] === "#" && (i === 0 || /\s/.test(raw[i - 1]))) {
        return raw.slice(0, i).trim();
      }
    }
    return raw.trim();
  }

  function parseWave(name) {
    const key = String(name || "").toLowerCase();
    if (!waveAliases[key]) throw new Error(`Unknown wave type: ${name}`);
    return waveAliases[key];
  }

  function noteToFreq(name) {
    const n = String(name || "").toLowerCase();
    if (!n) return 0;

    let i = 0;
    let part = "";

    if (n[0] >= "a" && n[0] <= "g") {
      part += n[0];
      i = 1;
      if (i < n.length && (n[i] === "#" || n[i] === "b")) {
        part += n[i];
        i++;
      }
    } else {
      throw new Error(`Invalid note: ${name}`);
    }

    if (i >= n.length || !/[0-9]/.test(n[i])) {
      throw new Error(`Missing octave in note: ${name}`);
    }

    const octaveMatch = n.slice(i).match(/^\d+/);
    const octave = Number(octaveMatch ? octaveMatch[0] : NaN);
    if (!Number.isFinite(octave) || octave < 0 || octave > 8) {
      throw new Error(`Octave must be 0-8: ${name}`);
    }

    if (!(part in noteMap)) throw new Error(`Unknown note name: ${name}`);

    const midi = (octave + 1) * 12 + noteMap[part];
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function parse(source) {
    const config = {
      tempo: 120,
      volume: 0.7,
      wave: "square",
      sampleRate: DEFAULT_SAMPLE_RATE,
      bits: 16
    };

    const events = [];
    let trackTime = 0;
    let inTrack = false;
    let trackWave = "square";
    let trackVol = 0.7;
    let linearTime = 0;
    const loopStack = [];

    function addEvent(ev) {
      if (loopStack.length) loopStack[loopStack.length - 1].body.push(ev);
      else events.push(ev);
    }

    const lines = String(source).split(/\r?\n/);

    for (let idx = 0; idx < lines.length; idx++) {
      const lineNum = idx + 1;
      let line = stripComment(lines[idx]);
      if (!line) continue;

      const parts = line.split(/\s+/);
      const cmd = parts[0].toLowerCase();

      try {
        if (cmd === "tempo") {
          const t = Number(parts[1]);
          if (!Number.isFinite(t) || t <= 0) throw new Error("tempo must be > 0");
          config.tempo = t;
        }
        else if (cmd === "volume") {
          const v = Number(parts[1]);
          if (!Number.isFinite(v) || v < 0 || v > 100) throw new Error("volume must be 0-100");
          if (inTrack) trackVol = v / 100;
          else config.volume = v / 100;
        }
        else if (cmd === "wave" || cmd === "instrument") {
          if (!parts[1]) throw new Error("wave requires a type");
          const w = parseWave(parts[1]);
          if (inTrack) trackWave = w;
          else config.wave = w;
        }
        else if (cmd === "track") {
          inTrack = true;
          trackTime = 0;
          trackWave = config.wave;
          trackVol = config.volume;
        }
        else if (cmd === "endtrack" || (cmd === "}" && inTrack && loopStack.length === 0)) {
          inTrack = false;
        }
        else if (cmd === "note") {
          const name = parts[1];
          const beats = Number(parts[2]);
          if (!name || !Number.isFinite(beats) || beats <= 0) {
            throw new Error("usage: note <pitch> <beats>");
          }

          const ev = {
            freqs: [noteToFreq(name)],
            durationBeats: beats,
            volume: inTrack ? trackVol : config.volume,
            wave: inTrack ? trackWave : config.wave,
            startBeat: inTrack ? trackTime : linearTime,
            drum: null
          };

          addEvent(ev);
          if (inTrack) trackTime += beats;
          else linearTime += beats;
        }
        else if (cmd === "rest") {
          const beats = Number(parts[1]);
          if (!Number.isFinite(beats) || beats <= 0) throw new Error("usage: rest <beats>");
          if (inTrack) trackTime += beats;
          else linearTime += beats;
        }
        else if (cmd === "chord") {
          const notes = [];
          let beats = 0;

          for (let i = 1; i < parts.length; i++) {
            const token = parts[i];
            const value = Number(token);
            if (token !== "" && Number.isFinite(value)) {
              beats = value;
              break;
            }
            notes.push(token);
          }

          if (!notes.length || beats <= 0) {
            throw new Error("usage: chord <notes...> <beats>");
          }

          const ev = {
            freqs: notes.map(noteToFreq),
            durationBeats: beats,
            volume: inTrack ? trackVol : config.volume,
            wave: inTrack ? trackWave : config.wave,
            startBeat: inTrack ? trackTime : linearTime,
            drum: null
          };

          addEvent(ev);
          if (inTrack) trackTime += beats;
          else linearTime += beats;
        }
        else if (["kick", "snare", "hihat", "tom"].includes(cmd)) {
          let beats = parts[1] === undefined ? 0.25 : Number(parts[1]);
          if (!Number.isFinite(beats) || beats <= 0) beats = 0.25;

          const ev = {
            freqs: [],
            durationBeats: beats,
            volume: inTrack ? trackVol : config.volume,
            wave: inTrack ? trackWave : config.wave,
            startBeat: inTrack ? trackTime : linearTime,
            drum: cmd
          };

          addEvent(ev);
          if (inTrack) trackTime += beats;
          else linearTime += beats;
        }
        else if (cmd === "loop") {
          const count = Number.parseInt(parts[1], 10);
          const brace = parts[2];
          if (!Number.isInteger(count) || count <= 0 || brace !== "{") {
            throw new Error("usage: loop <N> {");
          }

          loopStack.push({
            body: [],
            count,
            startTime: inTrack ? trackTime : linearTime
          });
        }
        else if (cmd === "}") {
          if (!loopStack.length) {
            if (inTrack) {
              inTrack = false;
              continue;
            }
            throw new Error("Unexpected '}'");
          }

          const frame = loopStack.pop();
          const body = frame.body;
          const count = frame.count;
          const startT = frame.startTime;

          let bodyDur = 0;
          for (const e of body) {
            bodyDur = Math.max(bodyDur, (e.startBeat - startT) + e.durationBeats);
          }

          const repeated = [];
          for (let i = 0; i < count; i++) {
            for (const sourceEvent of body) {
              const e = {
                ...sourceEvent,
                freqs: sourceEvent.freqs.slice(),
                startBeat: startT + i * bodyDur + (sourceEvent.startBeat - startT)
              };
              repeated.push(e);
            }
          }

          if (!loopStack.length) events.push(...repeated);
          else loopStack[loopStack.length - 1].body.push(...repeated);

          if (inTrack) trackTime = startT + count * bodyDur;
          else linearTime = startT + count * bodyDur;
        }
        else {
          throw new Error(`Unknown command: ${cmd}`);
        }
      } catch (err) {
        throw new Error(`Line ${lineNum}: ${err.message}`);
      }
    }

    if (loopStack.length) throw new Error("Unclosed loop {");

    return { config, events };
  }

  function sampleWave(wave, phase, t) {
    switch (wave) {
      case "sine":
        return Math.sin(2 * PI * phase);
      case "square":
        return phase < 0.5 ? 1 : -1;
      case "triangle":
        return 4 * Math.abs(phase - 0.5) - 1;
      case "saw":
        return 2 * phase - 1;
      case "pulse":
        return phase < 0.25 ? 1 : -1;
      case "noise": {
        let x = ((t * 44100 * 7 + phase * 1e6) >>> 0);
        x = (x ^ (x << 13)) >>> 0;
        x = (x ^ (x >>> 17)) >>> 0;
        x = (x ^ (x << 5)) >>> 0;
        return (x | 0) / 2147483648;
      }
      default:
        return 0;
    }
  }

  function renderDrum(ev, startS, nS, mix, sampleRate) {
    for (let i = 0; i < nS && startS + i < mix.length; i++) {
      const t = i / sampleRate;
      let env = 1;
      let sample = 0;

      if (ev.drum === "kick") {
        const freq = 150 * Math.exp(-t * 25);
        env = Math.exp(-t * 12);
        sample = Math.sin(2 * PI * freq * t) * 0.9
          + sampleWave("noise", t * 3, t) * 0.3;
      }
      else if (ev.drum === "snare") {
        env = Math.exp(-t * 18);
        sample = sampleWave("noise", t * 8, t) * 0.85
          + Math.sin(2 * PI * 200 * t) * 0.25 * Math.exp(-t * 30);
      }
      else if (ev.drum === "hihat") {
        env = Math.exp(-t * 40);
        sample = sampleWave("noise", t * 20, t) * 0.55;
      }
      else if (ev.drum === "tom") {
        const freq = 120 * Math.exp(-t * 8);
        env = Math.exp(-t * 9);
        sample = Math.sin(2 * PI * freq * t);
      }

      mix[startS + i] += sample * env * ev.volume;
    }
  }

  function render(parsed, options = {}) {
    const events = parsed.events;
    const cfg = { ...parsed.config };
    const sampleRate = options.sampleRate || cfg.sampleRate || DEFAULT_SAMPLE_RATE;

    if (!events.length) {
      return {
        samples: new Float32Array(0),
        sampleRate,
        durationSec: 0,
        peak: 0
      };
    }

    let maxBeat = 0;
    for (const e of events) {
      maxBeat = Math.max(maxBeat, e.startBeat + e.durationBeats);
    }

    const totalSec = maxBeat * (60 / cfg.tempo);
    const totalSamples = Math.floor(totalSec * sampleRate + 0.5);
    const mix = new Float64Array(totalSamples);

    for (const ev of events) {
      const startS = Math.floor(ev.startBeat * (60 / cfg.tempo) * sampleRate);
      const nS = Math.floor(ev.durationBeats * (60 / cfg.tempo) * sampleRate + 0.5);
      if (!nS) continue;

      if (ev.drum) {
        renderDrum(ev, startS, nS, mix, sampleRate);
        continue;
      }

      const voices = Math.min(ev.freqs.length, 8);
      if (!voices) continue;
      const durSec = ev.durationBeats * (60 / cfg.tempo);

      for (let i = 0; i < nS && startS + i < totalSamples; i++) {
        const t = i / sampleRate;
        let env = 1;
        const atk = 0.008;
        const rel = 0.05;

        if (t < atk) env = t / atk;
        else if (t > durSec - rel) env = Math.max(0, (durSec - t) / rel);

        let sample = 0;
        for (let v = 0; v < voices; v++) {
          const f = ev.freqs[v];
          if (f <= 0) continue;
          const phase = (f * t) % 1;
          sample += sampleWave(ev.wave, phase, t) * (1 / voices);
        }

        mix[startS + i] += sample * env * ev.volume;
      }
    }

    let peak = 0;
    for (let i = 0; i < mix.length; i++) peak = Math.max(peak, Math.abs(mix[i]));
    const norm = peak > 0.95 ? 0.95 / peak : 1;

    const out = new Float32Array(totalSamples);
    for (let i = 0; i < totalSamples; i++) {
      const s = Math.max(-1, Math.min(1, mix[i] * norm));
      const int16 = Math.trunc(s * 32767);
      out[i] = int16 / 32767;
    }

    return {
      samples: out,
      sampleRate,
      durationSec: totalSec,
      peak,
      config: cfg
    };
  }

  function wavBlob(rendered) {
    const samples = rendered.samples;
    const sampleRate = rendered.sampleRate;
    const dataSize = samples.length * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    function writeString(offset, str) {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }

    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, dataSize, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, Math.trunc(s * 32767), true);
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  const api = { parse, render, wavBlob, noteToFreq, sampleWave, DEFAULT_SAMPLE_RATE };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.LyraEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
