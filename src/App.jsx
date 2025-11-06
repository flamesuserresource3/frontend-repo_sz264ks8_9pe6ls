import { useEffect, useState } from "react";
import Header from "./components/Header";
import VolumeSlider from "./components/VolumeSlider";
import TestTone from "./components/TestTone";
import { Settings } from "lucide-react";

export default function App() {
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setVolume((v) => Math.min(1, +(v + 0.05).toFixed(2)));
      if (e.key === "ArrowDown") setVolume((v) => Math.max(0, +(v - 0.05).toFixed(2)));
      if (e.key.toLowerCase() === "m") setMuted((m) => !m);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <Header />

        <main className="px-6 md:px-10 pb-10">
          <section className="rounded-2xl p-6 md:p-8 bg-white/70 dark:bg-white/5 backdrop-blur border border-black/10 dark:border-white/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Output Volume</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Adjust system-like volume for the page audio</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Settings className="h-4 w-4" />
                Keyboard: ↑ ↓, M, Space
              </div>
            </div>

            <VolumeSlider
              value={muted ? 0 : volume}
              onChange={(v) => {
                setVolume(v);
                if (v > 0 && muted) setMuted(false);
              }}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
            />

            <div className="pt-2">
              <TestTone volume={volume} muted={muted} />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Note: Browsers don’t allow changing your device volume directly. This controller adjusts audio played on this page only.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
