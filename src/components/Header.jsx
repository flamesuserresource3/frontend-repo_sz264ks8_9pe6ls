import { Volume2 } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full py-6 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center shadow-lg shadow-indigo-500/30">
          <Volume2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Volume Controller
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fine-tune the sound level on this page with a live meter
          </p>
        </div>
      </div>
      <div className="hidden md:block text-xs text-gray-500 dark:text-gray-400">
        Tip: Use ↑ and ↓ keys to adjust, M to mute, Space to play a test tone
      </div>
    </header>
  );
}
