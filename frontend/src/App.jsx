import React, { useState, useEffect } from "react";
import BackgroundLayers from "./components/BackgroundLayers";
import MicOrb from "./components/MicOrb";
import ReviewCard from "./components/ReviewCard";
import InventoryGrid from "./components/InventoryGrid";
import { useVoiceRecorder } from "./hooks/useVoiceRecorder";
import {
  fetchInventory,
  processSpeechOrText,
  saveCatalogItem,
} from "./services/api";

export default function App() {
  const [items, setItems] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);

  const loadData = async () => {
    try {
      const data = await fetchInventory();
      setItems(data);
    } catch (e) {
      console.warn("Backend not reachable or offline; using default view.", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAudioFinished = async (blob, simulatedText) => {
    setLoading(true);
    try {
      const res = await processSpeechOrText(simulatedText || "", blob);
      setExtracted(res.extracted);
    } catch (err) {
      alert("Failed to process voice input. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const { isRecording, startRecording, stopRecording } =
    useVoiceRecorder(handleAudioFinished);

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    try {
      const res = await processSpeechOrText(textInput);
      setExtracted(res.extracted);
    } catch (err) {
      alert("Extraction failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async () => {
    if (!extracted) return;
    try {
      await saveCatalogItem(extracted);
      setExtracted(null);
      setTextInput("");
      loadData();
    } catch (err) {
      alert("Error saving item.");
    }
  };

  return (
    <main className="app-shell">
      <BackgroundLayers />

      <div className="app-frame">
        <header className="topbar">
          <div className="title-wrap">
            <h1 className="app-name">Bharat Catalog Engine</h1>
            <p className="tagline">Digital billing for everyday kirana.</p>
          </div>

          <div className="status-pill" aria-live="polite">
            <span className="status-dot" />
            <span>Ready</span>
          </div>
        </header>

        <section className="capture-panel">
          <div className="hero-copy">
            <p className="eyebrow">AI catalog capture</p>
            <h2>Bol do, stock update ho jaaye</h2>
          </div>

          <MicOrb
            isListening={isRecording}
            isProcessing={loading}
            isSuccess={Boolean(extracted)}
            ariaLabel={isRecording ? "Stop voice capture" : "Start voice capture"}
            onClick={isRecording ? stopRecording : startRecording}
          />

          <div className="divider-row">
            <span className="divider-line" />
            <span className="ya-label">ya</span>
            <span className="divider-line" />
          </div>

          <div className="input-row">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder='Aashirvaad atta 5 kg, 240 rupaye...'
              aria-label="Item description"
            />
            <button
              type="button"
              onClick={handleTextSubmit}
              disabled={loading || !textInput}
              className="process-btn"
            >
              {loading ? "Processing..." : "Process"}
            </button>
          </div>
        </section>

        {extracted && (
          <ReviewCard
            item={extracted}
            onChange={setExtracted}
            onSave={handleSaveItem}
            onCancel={() => setExtracted(null)}
          />
        )}

        <InventoryGrid items={items} onRefresh={loadData} loading={loading} />
      </div>

      <style>{`
        .app-shell {
          position: relative;
          min-height: 100vh;
          background: var(--bg-base);
          color: var(--text-primary);
          overflow: hidden;
          font-family: "Figtree", sans-serif;
        }

        .app-frame {
          position: relative;
          z-index: 1;
          width: min(760px, calc(100% - 24px));
          margin: 0 auto;
          padding: 40px 0 56px;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 28px;
          padding: 2px 4px 0;
        }

        .title-wrap {
          display: grid;
          gap: 6px;
        }

        .app-name {
          margin: 0;
          font-size: 34px;
          line-height: 40px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #332a24;
        }

        .tagline {
          margin: 6px 0 0;
          color: var(--text-tertiary);
          font-size: 11px;
          line-height: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(28, 154, 102, 0.18);
          background: rgba(28, 154, 102, 0.08);
          color: #1f7e56;
          font-size: 11px;
          line-height: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          backdrop-filter: blur(12px);
        }

        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success);
          box-shadow: 0 0 12px rgba(28,154,102,0.4);
        }

        .capture-panel {
          position: relative;
          padding: 26px 22px 22px;
          border-radius: var(--r-xl);
          border: 1px solid var(--border-subtle);
          background: linear-gradient(180deg, rgba(255,255,255,0.76), rgba(252,246,240,0.9));
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: var(--glow-soft);
          margin-bottom: 18px;
        }

        .hero-copy {
          text-align: center;
          margin-bottom: 12px;
        }

        .eyebrow {
          margin: 0 0 6px;
          color: var(--text-secondary);
          font-size: 11px;
          line-height: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .hero-copy h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 24px;
          line-height: 30px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .divider-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 18px 0 18px;
          color: var(--text-tertiary);
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--border-subtle);
        }

        .ya-label {
          font-size: 11px;
          line-height: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: lowercase;
        }

        .input-row {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          margin-top: 6px;
        }

        input {
          width: 100%;
          height: 48px;
          padding: 0 20px;
          border-radius: var(--r-full);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.75);
          color: var(--text-primary);
          outline: none;
          transition: border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease;
        }

        input::placeholder {
          color: var(--text-tertiary);
        }

        input:focus {
          border-color: rgba(240,122,58,0.42);
          box-shadow: 0 0 0 1px rgba(240,122,58,0.2), 0 0 18px rgba(240,122,58,0.12);
        }

        input:focus-visible {
          outline: none;
        }

        .process-btn {
          min-width: 120px;
          height: 48px;
          padding: 0 20px;
          border: 0;
          border-radius: var(--r-full);
          background: var(--sunset);
          color: white;
          font-size: 15px;
          line-height: 23px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 120ms cubic-bezier(0.2,0,0,1), opacity 120ms ease, box-shadow 120ms ease;
          box-shadow: 0 0 20px rgba(240,122,58,0.2);
        }

        .process-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 0 24px rgba(240,122,58,0.24);
        }

        .process-btn:disabled {
          opacity: 0.4;
          box-shadow: none;
          cursor: not-allowed;
        }

        @media (max-width: 560px) {
          .topbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .input-row {
            flex-direction: column;
          }

          .process-btn {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
