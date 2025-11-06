import { useEffect, useMemo, useRef, useState } from "react";
import AudioVisualizer from "./AudioVisualizer";
import { Play, Square } from "lucide-react";

export default function TestTone({ volume, muted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const gainRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  const init = () => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const gain = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      gain.connect(analyser);
      analyser.connect(ctx.destination);
      gainRef.current = gain;
      analyserRef.current = analyser;
    }
  };

  const start = () => {
    init();
    if (!audioCtxRef.current || !gainRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.connect(gainRef.current);
    osc.start();
    sourceRef.current = osc;
    setIsPlaying(true);
  };

  const stop = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    // sync volume
    if (!gainRef.current) return;
    const target = muted ? 0 : volume;
    gainRef.current.gain.setTargetAtTime(target, audioCtxRef.current.currentTime, 0.01);
  }, [volume, muted]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        isPlaying ? stop() : start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => (isPlaying ? stop() : start())}
        className="h-10 w-28 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/30 transition-colors flex items-center justify-center gap-2"
      >
        {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isPlaying ? "Stop" : "Play"}
      </button>
      <AudioVisualizer audioContext={audioCtxRef.current} analyser={analyserRef.current} />
    </div>
  );
}
