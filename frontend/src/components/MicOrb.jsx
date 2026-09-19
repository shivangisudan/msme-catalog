import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, Waves } from "lucide-react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function MicOrb({
  isListening = false,
  isProcessing = false,
  isSuccess = false,
  onClick,
  ariaLabel = "Start voice capture",
}) {
  const [audioLevels, setAudioLevels] = useState([0.3, 0.5, 0.7, 0.6, 0.4]);
  const [isHovering, setIsHovering] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    if (!isListening) return;

    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const context = new AudioCtx();
        const analyser = context.createAnalyser();
        const source = context.createMediaStreamSource(stream);
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        audioContextRef.current = context;

        const update = () => {
          if (!analyserRef.current) return;
          const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(buffer);
          const next = Array.from({ length: 5 }, (_, index) => {
            const start = Math.floor((buffer.length / 5) * index);
            const end = Math.floor((buffer.length / 5) * (index + 1));
            const slice = buffer.slice(start, end);
            const avg = slice.reduce((sum, value) => sum + value, 0) / Math.max(slice.length, 1);
            return clamp(avg / 255, 0.18, 1);
          });
          setAudioLevels(next);
          animationFrameRef.current = requestAnimationFrame(update);
        };
        update();
      } catch {
        let phase = 0;
        const synthetic = () => {
          if (!isListening) return;
          setAudioLevels((prev) =>
            Array.from({ length: 5 }, (_, i) => {
              const base = Math.sin((phase + i * 0.8) * 1.5) * 0.5 + 0.5;
              return clamp(base * 0.9 + 0.15, 0.2, 1);
            })
          );
          phase += 0.3;
          animationFrameRef.current = requestAnimationFrame(synthetic);
        };
        synthetic();
      }
    };

    setupAudio();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      analyserRef.current = null;
    };
  }, [isListening]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
    setMouseX(x * 12);
    setMouseY(y * 12);
  };

  const style = useMemo(
    () => ({
      transform: `translate(${isHovering ? mouseX * 0.7 : 0}px, ${isHovering ? mouseY * 0.7 : 0}px) scale(${isListening ? 1.02 : 1})`,
    }),
    [isHovering, isListening, mouseX, mouseY]
  );

  return (
    <div className="mic-shell" onMouseMove={handleMouseMove} onMouseLeave={() => setIsHovering(false)}>
      {isListening && (
        <div className="mic-ripple-wrap" aria-hidden="true">
          <span className="mic-ring ring-one" />
          <span className="mic-ring ring-two" />
          <span className="mic-ring ring-three" />
        </div>
      )}

      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setIsHovering(true)}
        aria-label={ariaLabel}
        aria-pressed={isListening}
        className={`mic-orb ${isListening ? "listening" : ""} ${isProcessing ? "processing" : ""} ${isSuccess ? "success" : ""}`}
        style={style}
      >
        <span className="mic-glow" aria-hidden="true" />
        {isListening ? (
          <span className="waveform" aria-hidden="true">
            {audioLevels.map((level, index) => (
              <span
                key={index}
                className="wave-bar"
                style={{ height: `${Math.max(18, level * 44)}px` }}
              />
            ))}
          </span>
        ) : (
          <Mic size={36} strokeWidth={2.4} />
        )}
      </button>

      {isListening && <p className="mic-caption">Sun raha hoon…</p>}

      <style>{`
        .mic-shell {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .mic-orb {
          position: relative;
          width: 96px;
          height: 96px;
          border: 0;
          border-radius: 50%;
          background: var(--sunset);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--glow-accent);
          transition: transform 120ms cubic-bezier(0.2,0,0,1), box-shadow 120ms cubic-bezier(0.2,0,0,1), opacity 120ms ease;
          animation: orbBreath 4s ease-in-out infinite;
          cursor: pointer;
          z-index: 2;
          will-change: transform;
        }

        .mic-orb:hover {
          box-shadow: 0 0 52px -8px rgba(255,107,44,0.7);
        }

        .mic-orb:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 4px;
        }

        .mic-orb.listening {
          animation: none;
          width: 96px;
          height: 96px;
        }

        .mic-orb.processing {
          width: 80px;
          height: 80px;
          animation: shimmerPulse 1.2s ease-in-out infinite;
        }

        .mic-orb.success {
          animation: spark 0.55s ease-out forwards;
        }

        .mic-glow {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: rgba(255,107,44,0.18);
          filter: blur(18px);
          z-index: -1;
        }

        .waveform {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 46px;
          transform: translateY(2px);
        }

        .wave-bar {
          display: block;
          width: 5px;
          border-radius: 999px;
          background: rgba(255,255,255,0.9);
          box-shadow: 0 0 12px rgba(255,255,255,0.4);
          transition: height 120ms ease;
        }

        .mic-ripple-wrap {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 176px;
          height: 176px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          z-index: 1;
          pointer-events: none;
          filter: saturate(1.15);
        }

        .mic-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(255, 181, 110, 0.52);
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(255, 118, 46, 0.12), 0 0 22px rgba(240, 122, 58, 0.12);
          animation: ripple 2.6s ease-out infinite;
          opacity: 0.76;
        }

        .ring-two { animation-delay: 0.9s; }
        .ring-three { animation-delay: 1.8s; }

        .mic-caption {
          margin: 0;
          font-size: 13px;
          line-height: 18px;
          font-weight: 500;
          color: var(--text-secondary);
          opacity: 0.9;
          animation: blurPulse 1.8s ease-in-out infinite;
        }

        @keyframes orbBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.035); }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.82);
            opacity: 0.72;
          }
          65% {
            opacity: 0.34;
          }
          100% {
            transform: scale(2.75);
            opacity: 0;
          }
        }

        @keyframes shimmerPulse {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes blurPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes spark {
          0% { transform: scale(1); filter: brightness(1); }
          48% { transform: scale(1.15); filter: brightness(1.2); }
          100% { transform: scale(1); filter: brightness(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .mic-orb,
          .mic-ring,
          .mic-caption {
            animation: none !important;
          }
          .mic-ripple-wrap { display: none; }
        }
      `}</style>
    </div>
  );
}
