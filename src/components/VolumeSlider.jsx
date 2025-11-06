import { useEffect, useMemo, useRef, useState } from "react";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";

export default function VolumeSlider({ value, onChange, muted, onToggleMute }) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);

  const icon = useMemo(() => {
    if (muted || value === 0) return <VolumeX className="h-5 w-5" />;
    if (value < 0.34) return <Volume className="h-5 w-5" />;
    if (value < 0.67) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  }, [value, muted]);

  const percent = Math.min(100, Math.max(0, Math.round(value * 100)));

  useEffect(() => {
    const onUp = () => setIsDragging(false);
    const onMove = (e) => {
      if (!isDragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX, rect.left), rect.right);
      const ratio = (x - rect.left) / rect.width;
      onChange(Number(ratio.toFixed(2)));
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [isDragging, onChange]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMute}
          className="h-10 w-10 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur border border-black/10 dark:border-white/10 grid place-items-center hover:shadow-md transition-shadow"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {icon}
        </button>
        <div
          ref={trackRef}
          className="relative h-3 flex-1 rounded-full bg-black/10 dark:bg-white/10 select-none cursor-pointer"
          onMouseDown={(e) => {
            setIsDragging(true);
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            onChange(Number(Math.min(1, Math.max(0, ratio)).toFixed(2)));
          }}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={Number(value.toFixed(2))}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
            style={{ width: `${percent}%` }}
          />
          <div
            className="absolute -top-1.5 -translate-x-1/2 h-6 w-6 rounded-full bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 shadow flex items-center justify-center"
            style={{ left: `${percent}%` }}
          >
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
          </div>
        </div>
        <div className="w-12 text-right tabular-nums text-sm text-gray-600 dark:text-gray-300">
          {Math.round(value * 100)}%
        </div>
      </div>
    </div>
  );
}
