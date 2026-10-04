(function () {
  const editor = document.getElementById("editor");
  const run = document.getElementById("run");
  const stop = document.getElementById("stop");
  const wav = document.getElementById("wav");
  const status = document.getElementById("status");
  const tempo = document.getElementById("tempo-value");
  const events = document.getElementById("event-value");
  const length = document.getElementById("length-value");
  const sourceFile = document.getElementById("source-file");
  const openSource = document.getElementById("open-source");
  const visualizer = document.getElementById("visualizer");
  const search = document.getElementById("search-input");

  let rendered = null;
  let audioContext = null;
  let source = null;
  let currentName = "intro";

  for (let i = 0; i < 24; i++) {
    const bar = document.createElement("span");
    bar.style.setProperty("--h", `${20 + ((i * 17) % 58)}%`);
    visualizer.appendChild(bar);
  }

  function fmtTime(sec) {
    sec = Math.max(0, Number(sec) || 0);
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function inspect() {
    const parsed = LyraEngine.parse(editor.value);
    let maxBeat = 0;
    for (const ev of parsed.events) maxBeat = Math.max(maxBeat, ev.startBeat + ev.durationBeats);
    tempo.textContent = `${parsed.config.tempo} BPM`;
    events.textContent = String(parsed.events.length);
    length.textContent = fmtTime(maxBeat * 60 / parsed.config.tempo);
    rendered = null;
    status.textContent = "Ready";
    status.dataset.state = "ok";
    return parsed;
  }

  function setError(err) {
    status.textContent = err.message.replace(/^Line /, "Line ");
    status.dataset.state = "error";
  }

  function stopAudio() {
    if (source) {
      try { source.stop(); } catch (_) {}
      try { source.disconnect(); } catch (_) {}
      source = null;
    }
    visualizer.classList.remove("playing");
    if (status.dataset.state !== "error") {
      status.textContent = "Stopped";
      status.dataset.state = "ok";
    }
  }

  function setExample(name) {
    currentName = name;
    editor.value = LYRA_EXAMPLES[name];
    document.querySelectorAll(".example-pill").forEach(el => {
      el.classList.toggle("active", el.dataset.example === name);
    });
    try { inspect(); } catch (err) { setError(err); }
  }

  editor.addEventListener("input", () => {
    try { inspect(); } catch (err) { setError(err); }
  });

  document.querySelectorAll(".example-pill").forEach(btn => {
    btn.addEventListener("click", () => setExample(btn.dataset.example));
  });

  run.addEventListener("click", async () => {
    try {
      stopAudio();
      const parsed = inspect();
      status.textContent = "Rendering";
      rendered = LyraEngine.render(parsed);
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") await audioContext.resume();
      const buffer = audioContext.createBuffer(1, rendered.samples.length, rendered.sampleRate);
      buffer.copyToChannel(rendered.samples, 0);
      source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.onended = () => {
        source = null;
        visualizer.classList.remove("playing");
        status.textContent = "Finished";
        status.dataset.state = "ok";
      };
      source.start();
      visualizer.classList.add("playing");
      status.textContent = "Playing";
      status.dataset.state = "ok";
    } catch (err) {
      setError(err);
    }
  });

  stop.addEventListener("click", stopAudio);

  wav.addEventListener("click", () => {
    try {
      const parsed = inspect();
      rendered = rendered || LyraEngine.render(parsed);
      const blob = LyraEngine.wavBlob(rendered);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentName}.wav`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      status.textContent = "WAV saved";
      status.dataset.state = "ok";
    } catch (err) {
      setError(err);
    }
  });

  openSource.addEventListener("click", () => sourceFile.click());

  sourceFile.addEventListener("change", async () => {
    const file = sourceFile.files && sourceFile.files[0];
    if (!file) return;
    currentName = file.name.replace(/\.lyra$/i, "") || "example";
    editor.value = await file.text();
    document.querySelectorAll(".example-pill").forEach(el => el.classList.remove("active"));
    try { inspect(); } catch (err) { setError(err); }
    sourceFile.value = "";
  });

  if (search) {
    search.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      const q = search.value.toLowerCase().trim();
      if (q.includes("play")) location.hash = "#playground";
      else if (q.includes("arch")) location.hash = "#architecture";
      else location.hash = "#language-reference";
    });
  }

  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const old = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => btn.textContent = old, 900);
      } catch (_) {}
    });
  });

  setExample("intro");
})();