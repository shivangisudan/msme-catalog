import { useEffect, useState } from "react";
import Aurora from "./Aurora";

export default function BackgroundLayers() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return (
    <>
      <div className="aurora-edge-layer" aria-hidden="true">
        <div className="aurora-edge aurora-edge-primary">
          <Aurora
            colorStops={["#FF9933", "#FFFFFF", "#138808"]}
            amplitude={1.2}
            blend={0.64}
            speed={0.7}
          />
        </div>
        <div className="aurora-edge aurora-edge-reflection">
          <Aurora
            colorStops={["#138808", "#FFFFFF", "#FF9933"]}
            amplitude={1.05}
            blend={0.72}
            speed={0.52}
          />
        </div>
      </div>
      <div className="background-grid" aria-hidden="true" />
      <div className={`background-blobs ${prefersReducedMotion ? "reduced" : ""}`} aria-hidden="true">
        <span className="blob blob-one" />
        <span className="blob blob-two" />
      </div>
      <style>{`
        .aurora-edge-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          opacity: 0.4;
          filter: saturate(1.65) contrast(1.08);
          -webkit-mask-image: radial-gradient(ellipse at center, transparent 34%, rgba(0,0,0,0.18) 55%, #000 78%, #000 100%);
          mask-image: radial-gradient(ellipse at center, transparent 34%, rgba(0,0,0,0.18) 55%, #000 78%, #000 100%);
        }

        .aurora-edge {
          position: absolute;
          inset: -8%;
          opacity: 0.9;
        }

        .aurora-edge-reflection {
          transform: rotate(180deg) scale(1.04);
          opacity: 0.62;
          mix-blend-mode: screen;
        }

        .background-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: linear-gradient(rgba(121, 89, 60, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(121, 89, 60, 0.07) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(circle at center, black 38%, transparent 100%);
          opacity: 0.9;
          animation: gridDrift 60s linear infinite;
        }

        .background-blobs {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          filter: blur(80px);
          opacity: 0.7;
        }

        .blob {
          position: absolute;
          width: 32rem;
          height: 32rem;
          border-radius: 50%;
          opacity: 0.18;
          animation: blobFloat 24s ease-in-out infinite alternate;
        }

        .blob-one {
          top: -10%;
          left: -8%;
          background: rgba(255, 160, 88, 0.7);
        }

        .blob-two {
          right: -10%;
          bottom: -12%;
          background: rgba(160, 116, 255, 0.7);
          animation-duration: 28s;
        }

        .background-blobs.reduced .blob,
        .background-blobs.reduced + .background-grid {
          animation: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .aurora-edge-layer {
            display: none;
          }
        }

        @keyframes gridDrift {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(44px, 44px, 0); }
        }

        @keyframes blobFloat {
          0% { transform: translate3d(0, 0, 0) scale(0.95); }
          100% { transform: translate3d(22px, -18px, 0) scale(1.08); }
        }
      `}</style>
    </>
  );
}
