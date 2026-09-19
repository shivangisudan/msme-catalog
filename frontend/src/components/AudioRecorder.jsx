import React from "react";
import { Mic, MicOff } from "lucide-react";

export default function AudioRecorder({ isRecording, onStart, onStop }) {
  return (
    <div className="flex flex-col items-center justify-center my-4">
      <button
        onClick={isRecording ? onStop : onStart}
        className={`p-6 rounded-full transition-all duration-300 shadow-xl flex items-center justify-center ${
          isRecording
            ? "bg-rose-500 text-white animate-pulse ring-8 ring-rose-200"
            : "bg-orange-500 hover:bg-orange-600 text-white hover:scale-105"
        }`}
      >
        {isRecording ? <MicOff size={36} /> : <Mic size={36} />}
      </button>
      <p className="text-xs font-semibold text-slate-500 mt-3">
        {isRecording
          ? "Sun rahe hain... (Tap to finish speaking)"
          : "Tap mic to speak (Hindi / Hinglish / English)"}
      </p>
    </div>
  );
}
