const API_BASE = "http://127.0.0.1:8000";

export async function fetchInventory() {
  const res = await fetch(`${API_BASE}/api/catalog/items`);
  if (!res.ok) {
    throw new Error("Failed to load inventory");
  }
  return res.json();
}

export async function processSpeechOrText(transcript, audioBlob = null) {
  const formData = new FormData();
  if (transcript) formData.append("transcript", transcript);
  if (audioBlob) formData.append("audio_file", audioBlob, "audio.webm");

  const res = await fetch(`${API_BASE}/api/catalog/process`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Processing failed");
  }
  return res.json();
}

export async function saveCatalogItem(item) {
  const res = await fetch(`${API_BASE}/api/catalog/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    throw new Error("Failed to save item");
  }
  return res.json();
}
