Markdown
# 🇮🇳 Bharat Catalog Engine

> **Voice-First Inventory Digitization for Indian Kirana & MSME Retailers**

Bharat Catalog Engine addresses a critical operational friction in micro-retail across India: catalog creation and manual stock updates. Traditional point-of-sale systems demand typing complex SKUs, weights, and prices on cramped screens. 

Bharat Catalog Engine allows shopkeepers to speak naturally in **Hindi, Hinglish, or Indian English** (e.g., *"Aashirvaad atta 5 kilo packet 240 rupaye 10 packet"*). The system automatically isolates product brands, calculates stock levels, identifies packaging units, normalizes pricing into rupees, and presents a one-tap review interface before updating the catalog.

---

## 🏗 System Architecture

[ Shopkeeper Voice / Hinglish Audio ]
│
▼
[ Browser Web Speech API ]
(Indian English en-IN & Hindi hi-IN)
│
▼ (Raw Speech Transcript)
[ FastAPI Ingestion Gateway ]
│
▼
[ Indic Entity Extraction Pipeline ]
├── Devanagari Numeral & Script Normalization
├── Heuristic Brand & Packaging Classification
└── Extensible AWS Bedrock / Claude 3.5 Engine
│
▼ (Structured JSON SKU)
[ Human-in-the-Loop Review Card ]
(React + Stepper Controls + Category Chips)
│
▼ (Confirmed Verification)
[ SQLite Catalog Store ]
│
▼
[ Real-Time Inventory Dashboard ]

---

## ✨ Key Features

- **Voice-First Data Entry:** Native Web Speech API integration calibrated for Indian speech patterns (`en-IN` / `hi-IN`), eliminating manual keyboard dependency.
- **Multilingual Entity Extraction:** Converts casual phrasing into clean, normalized JSON records containing:
  - `product_name` (Brand & title standardization)
  - `category` (Auto-shelf sorting: Staples, Cooking Oil, Flour, Snacks, Biscuits, etc.)
  - `unit_quantity` (Metric & pack volume isolation: `1 kg`, `500g`, `1 L`)
  - `mrp_inr` (Numerical retail price in ₹)
  - `stock_quantity` (Current units available)
- **Human-in-the-Loop (HITL) Validation:** An interactive UI card displays extracted data before it enters the database, complete with `+`/`-` stock steppers and quick-select category tags.
- **Instant Local Verification:** Full local prototype running on lightweight SQLite with RESTful CRUD endpoints.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React |
| **Backend** | FastAPI (Python 3.10+), Uvicorn, Pydantic |
| **Database** | SQLite3 (Persistent disk storage) |
| **Speech & NLP** | Web Speech API, Regex Heuristic Engine, Indic Transliteration |
| **Deployment / CI** | Git, Vercel-ready frontend, Uvicorn ASGI server |

---

## 📁 Repository Structure

```text
msme-catalog/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints/
│   │   │       ├── catalog.py       # CRUD operations for catalog items
│   │   │       └── process.py       # Speech/text processing entry point
│   │   ├── models/
│   │   │   └── item.py              # Pydantic schemas for inventory items
│   │   ├── services/
│   │   │   └── extractor.py         # Indic normalization & entity extraction
│   │   ├── database.py              # SQLite connection & schema init
│   │   └── main.py                  # FastAPI application entrypoint
│   ├── requirements.txt             # Python dependencies
│   └── seed_data.py                 # Initial Kirana sample items
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudioRecorder.jsx    # Microphone recording interface
│   │   │   ├── ReviewCard.jsx       # Interactive HITL validation card
│   │   │   └── InventoryGrid.jsx    # Live inventory table
│   │   ├── hooks/
│   │   │   └── useVoiceRecorder.js  # Web Speech API & audio stream hook
│   │   ├── services/
│   │   │   └── api.js               # REST client for backend endpoints
│   │   ├── App.jsx                  # Main dashboard composition
│   │   ├── main.jsx                 # React root render
│   │   └── index.css                # Tailwind CSS v4 directives
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md

## Local Development Setup
Prerequisites
Node.js: v18 or higher

Python: v3.10 or higher

Git

Backend Setup (FastAPI)
Bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations and seed baseline items
python seed.py

# Start development server
uvicorn app.main:app --reload --port 8000

Frontend Setup (React / Vite)
Open a second terminal window:

Bash
cd frontend

# Install package dependencies
npm install

# Start Vite local development server
npm run dev

🔌 API Reference1. Fetch InventoryHTTPGET /api/catalog/items
Response:JSON[
  {
    "id": 1,
    "product_name": "Tata Salt (Vacuum Evaporated)",
    "category": "Staples",
    "unit_quantity": "1 kg",
    "mrp_inr": 28.0,
    "stock_quantity": 25,
    "created_at": "2026-09-19T11:52:21"
  }
]
2. Process Natural Speech / TextHTTPPOST /api/catalog/process
Content-Type: multipart/form-data
ParameterTypeDescriptiontranscriptstring (Optional)Spoken text transcriptaudio_filebinary (Optional)Audio recording blob (audio/webm)Response:JSON{
  "status": "success",
  "extracted": {
    "product_name": "Fortune Sunlite Sunflower Oil",
    "category": "Cooking Oil",
    "unit_quantity": "1 L",
    "mrp_inr": 145.0,
    "stock_quantity": 20
  }
}
3. Add Verified Item to CatalogHTTPPOST /api/catalog/items
Content-Type: application/json

{
  "product_name": "Fortune Sunlite Sunflower Oil",
  "category": "Cooking Oil",
  "unit_quantity": "1 L",
  "mrp_inr": 145.0,
  "stock_quantity": 20
}
👥 ContributorsAdicuno (@Adicuno)Shivangi Sudan (@shivangisudan)📄 LicenseThis project is open-source under the MIT License.'@ | Out-File -FilePath "README.md" -Encoding utf8
---

### Push it to GitHub in 3 steps:

```powershell
git add README.md
git commit -m "docs: add complete project README"
git push origin main