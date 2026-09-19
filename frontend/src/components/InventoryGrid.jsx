import React, { useMemo, useState } from "react";
import { Package, IndianRupee, RefreshCw } from "lucide-react";

const badgeTone = (category) => {
  const normalized = String(category || "General").toLowerCase();
  if (normalized.includes("oil") || normalized.includes("ghee")) return "category-oil";
  if (normalized.includes("atta") || normalized.includes("flour") || normalized.includes("grain")) return "category-grain";
  if (normalized.includes("snack") || normalized.includes("bis")) return "category-snack";
  if (normalized.includes("milk") || normalized.includes("dairy")) return "category-dairy";
  if (normalized.includes("bever") || normalized.includes("soft")) return "category-beverage";
  return "category-default";
};

const stockTone = (stock) => {
  const value = Number(stock || 0);
  if (value > 20) return { label: String(value), tone: "stock-good" };
  if (value >= 5) return { label: String(value), tone: "stock-warning" };
  return { label: String(value), tone: "stock-danger" };
};

const normalizeCategory = (category) => {
  const normalized = String(category || "General").trim().toLowerCase();
  if (["cooking oil", "oil", "sunflower oil", "groundnut oil", "mustard oil"].some((value) => normalized.includes(value))) return "Cooking Oil";
  if (["flour", "atta", "wheat", "grain", "gehu"].some((value) => normalized.includes(value))) return "Flour";
  if (["snacks", "noodles", "namkeen", "chips", "biscuits", "cookies", "biscuit"].some((value) => normalized.includes(value))) return "Snacks";
  if (["dairy", "milk", "curd", "paneer", "ghee"].some((value) => normalized.includes(value))) return "Dairy";
  if (["beverages", "soft drinks", "juice", "cold drink", "drink"].some((value) => normalized.includes(value))) return "Beverages";
  if (["staples", "salt", "rice", "dal", "spices", "pulses"].some((value) => normalized.includes(value))) return "Staples";
  if (["biscuit", "cookies"].some((value) => normalized.includes(value))) return "Snacks";
  return "General";
};

const categoryGradient = (category) => {
  const normalized = String(category || "General").toLowerCase();
  if (normalized.includes("oil")) return "linear-gradient(135deg, #f9d88d 0%, #f2b24d 50%, #d47a12 100%)";
  if (normalized.includes("flour") || normalized.includes("atta") || normalized.includes("grain")) return "linear-gradient(135deg, #a9e8bf 0%, #62cf92 50%, #2e9a6d 100%)";
  if (normalized.includes("snack") || normalized.includes("bis")) return "linear-gradient(135deg, #f9bfd4 0%, #ea7b9f 52%, #c73b6e 100%)";
  if (normalized.includes("dairy") || normalized.includes("milk") || normalized.includes("ghee")) return "linear-gradient(135deg, #d5d2ff 0%, #9f8efc 52%, #6550d1 100%)";
  if (normalized.includes("bever") || normalized.includes("soft") || normalized.includes("drink")) return "linear-gradient(135deg, #ffcbb1 0%, #f6935b 52%, #de5d2e 100%)";
  if (normalized.includes("staple") || normalized.includes("salt") || normalized.includes("rice") || normalized.includes("dal")) return "linear-gradient(135deg, #f9ddab 0%, #e8a853 52%, #c87923 100%)";
  return "linear-gradient(135deg, #f5d5a8 0%, #efb45f 50%, #d07d28 100%)";
};

const timeAgo = (value) => {
  if (!value) return "Just now";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes} min pehle`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr pehle`;
  const days = Math.round(hours / 24);
  return `${days} din pehle`;
};

export default function InventoryGrid({ items, onRefresh, loading = false }) {
  const safeItems = Array.isArray(items) ? items : [];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState("catalog");

  const categoryData = useMemo(() => {
    const totals = safeItems.reduce((acc, item) => {
      const name = normalizeCategory(item.category);
      acc[name] = (acc[name] || 0) + Number(item.stock_quantity || 0);
      return acc;
    }, {});

    const totalStock = Object.values(totals).reduce((sum, value) => sum + value, 0);

    return Object.entries(totals)
      .map(([name, total]) => ({
        name,
        total,
        share: totalStock ? total / totalStock : 0,
        gradient: categoryGradient(name),
        status: total > 20 ? "Healthy" : total > 8 ? "Watch" : "Low",
      }))
      .sort((a, b) => b.total - a.total);
  }, [safeItems]);

  const maxCategoryTotal = Math.max(...categoryData.map((entry) => entry.total), 1);
  const activeCategory = selectedCategory || categoryData[0]?.name || null;
  const activeEntry = categoryData.find((entry) => entry.name === activeCategory) || categoryData[0] || null;

  return (
    <div className="catalog-shell">
      <div className="catalog-header">
        <h2 className="catalog-title">
          <Package size={18} />
          <span>Aapka Catalog</span>
          <span className="catalog-count">{safeItems.length}</span>
        </h2>
        <button type="button" onClick={onRefresh} className="refresh-btn" aria-label="Refresh catalog">
          <RefreshCw size={16} />
        </button>
      </div>

      {safeItems.length > 0 && (
        <div className="view-switcher" aria-label="Inventory view switcher">
          <button
            type="button"
            className={viewMode === "catalog" ? "view-tab active" : "view-tab"}
            onClick={() => setViewMode("catalog")}
          >
            Actual catalogue
          </button>
          <button
            type="button"
            className={viewMode === "overview" ? "view-tab active" : "view-tab"}
            onClick={() => setViewMode("overview")}
          >
            Inventory overview
          </button>
        </div>
      )}

      {!loading && safeItems.length > 0 && viewMode === "overview" && (
        <div className="chart-panel">
          <div className="chart-header">
            <div>
              <p className="chart-kicker">Inventory overview</p>
              <h3>Stock by category</h3>
            </div>
            <div className="chart-summary">
              <span className="summary-label">Focus</span>
              <strong>{activeEntry?.name || "—"}</strong>
              <span className="summary-value">{activeEntry?.total || 0}</span>
            </div>
          </div>

          <div className="category-grid" role="list" aria-label="Category stock overview">
            {categoryData.map((entry) => (
              <button
                key={entry.name}
                type="button"
                className={`category-card ${activeCategory === entry.name ? "selected" : ""}`}
                style={{
                  "--card-fill": `${Math.max(12, entry.share * 100)}%`,
                  "--card-gradient": entry.gradient,
                }}
                onClick={() => setSelectedCategory(entry.name)}
                aria-label={`${entry.name} has ${entry.total} items in stock`}
              >
                <div className="card-topline">
                  <span className="card-dot" aria-hidden="true" />
                  <span className="card-name">{entry.name}</span>
                </div>

                <div className="card-metric">
                  <strong>{entry.total}</strong>
                  <span>units</span>
                </div>

                <div className="card-progress" aria-hidden="true">
                  <span className="card-progress-bar" />
                </div>

                <div className="card-foot">
                  <span>{Math.round(entry.share * 100)}% of stock</span>
                  <span className={`status-pill ${entry.status.toLowerCase()}`}>{entry.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="catalog-list">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="catalog-row skeleton-row" aria-hidden="true">
              <div className="skeleton-main">
                <span className="skeleton skeleton-line skeleton-line-lg" />
                <span className="skeleton skeleton-line skeleton-line-sm" />
              </div>
              <div className="skeleton-side">
                <span className="skeleton skeleton-line skeleton-line-md" />
                <span className="skeleton skeleton-line skeleton-line-xs" />
              </div>
            </div>
          ))}
        </div>
      ) : safeItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Package size={26} /></div>
          <p>Abhi tak kuch nahi — mic dabaiye</p>
        </div>
      ) : viewMode === "catalog" ? (
        <div className="catalog-list">
          {safeItems.map((item, index) => {
            const stock = stockTone(item.stock_quantity);
            return (
              <article
                key={item.id || `${item.product_name}-${index}`}
                className="catalog-row"
                style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
              >
                <div className="item-main">
                  <p className="product-name">{item.product_name}</p>
                  <div className="meta-row">
                    <span className={`category-pill ${badgeTone(item.category)}`}>{item.category || "General"}</span>
                    <span>{item.unit_quantity || "1 unit"}</span>
                    <span>{timeAgo(item.created_at)}</span>
                  </div>
                  <p className="price-row">
                    <IndianRupee size={12} />
                    <span>{Number(item.mrp_inr || 0).toFixed(2)}</span>
                  </p>
                </div>

                <div className="item-side">
                  <p className={`stock-row ${stock.tone}`}>
                    <span className="stock-label">Quantity</span>
                    <span className="stock-value">
                      <span className="stock-dot" />
                      <span>{stock.label}</span>
                    </span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      <style>{`
        .catalog-shell {
          margin-top: 18px;
          padding: 18px 16px 16px;
          border-radius: var(--r-xl);
          border: 1px solid var(--border-subtle);
          background: linear-gradient(180deg, rgba(255,255,255,0.72), rgba(252,246,240,0.92));
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: var(--glow-soft);
        }

        .catalog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .catalog-title {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          color: var(--text-primary);
          font-size: 19px;
          line-height: 26px;
          font-weight: 600;
          letter-spacing: -0.015em;
        }

        .catalog-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(255, 138, 83, 0.1);
          color: var(--text-secondary);
          font-size: 11px;
          line-height: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .refresh-btn {
          width: 36px;
          height: 36px;
          border: 1px solid var(--border-subtle);
          background: rgba(255,255,255,0.6);
          color: var(--text-secondary);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 120ms cubic-bezier(0.2,0,0,1), border-color 120ms ease, color 120ms ease;
        }

        .refresh-btn:hover {
          border-color: var(--border-strong);
          color: var(--text-primary);
        }

        .refresh-btn:active {
          transform: rotate(360deg);
        }

        .empty-state {
          display: grid;
          place-items: center;
          gap: 10px;
          min-height: 180px;
          border: 1px dashed var(--border-subtle);
          border-radius: var(--r-lg);
          color: var(--text-tertiary);
          text-align: center;
          background: rgba(255,255,255,0.34);
        }

        .empty-icon {
          display: inline-flex;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          background: rgba(255,255,255,0.66);
        }

        .empty-state p {
          margin: 0;
          font-size: 15px;
          line-height: 23px;
          font-weight: 500;
        }

        .view-switcher {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 16px;
          padding: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.48);
          border: 1px solid var(--border-subtle);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .view-tab {
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: var(--text-secondary);
          padding: 8px 12px;
          font-size: 11px;
          line-height: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
          cursor: pointer;
          transition: background 120ms ease, color 120ms ease, transform 120ms ease;
        }

        .view-tab.active {
          background: #f8d6b3;
          color: #8d4f28;
          box-shadow: 0 10px 20px -14px rgba(240,122,58,0.45);
        }

        .chart-panel {
          margin: 0 0 16px;
          padding: 16px 14px 12px;
          border: 1px solid var(--border-subtle);
          border-radius: var(--r-xl);
          background: linear-gradient(180deg, rgba(255,255,255,0.7), rgba(248,240,232,0.9));
          box-shadow: var(--glow-soft);
        }

        .chart-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .chart-kicker {
          margin: 0 0 4px;
          color: var(--text-tertiary);
          font-size: 10px;
          line-height: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .chart-header h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 18px;
          line-height: 22px;
          letter-spacing: -0.03em;
        }

        .chart-summary {
          display: grid;
          justify-items: end;
          gap: 2px;
          min-width: 90px;
          text-align: right;
        }

        .summary-label {
          color: var(--text-tertiary);
          font-size: 10px;
          line-height: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .chart-summary strong {
          color: var(--text-primary);
          font-size: 13px;
          line-height: 18px;
          font-weight: 700;
        }

        .summary-value {
          color: var(--accent);
          font-size: 22px;
          line-height: 24px;
          font-weight: 800;
          letter-spacing: -0.04em;
          font-variant-numeric: tabular-nums;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }

        .category-card {
          position: relative;
          display: grid;
          gap: 12px;
          width: 100%;
          text-align: left;
          border: 1px solid var(--border-subtle);
          border-radius: 18px;
          padding: 12px 12px 10px;
          background: rgba(255,255,255,0.56);
          color: var(--text-primary);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
          transition: transform 140ms ease, border-color 140ms ease, box-shadow 140ms ease;
          cursor: pointer;
        }

        .category-card:hover,
        .category-card.selected {
          transform: translateY(-2px);
          border-color: rgba(240,122,58,0.28);
          box-shadow: 0 18px 30px -22px rgba(121, 84, 47, 0.28), inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .card-topline {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .card-dot {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--card-gradient);
          box-shadow: 0 0 0 4px rgba(255,255,255,0.6);
        }

        .card-name {
          color: var(--text-primary);
          font-size: 12px;
          line-height: 16px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-metric {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-top: 6px;
        }

        .card-metric strong {
          color: var(--text-primary);
          font-size: 28px;
          line-height: 30px;
          letter-spacing: -0.06em;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
        }

        .card-metric span {
          color: var(--text-tertiary);
          font-size: 10px;
          line-height: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .card-progress {
          position: relative;
          width: 100%;
          height: 8px;
          border-radius: 999px;
          background: rgba(121, 96, 74, 0.08);
          overflow: hidden;
        }

        .card-progress-bar {
          display: block;
          width: var(--card-fill, 50%);
          min-width: 10%;
          height: 100%;
          border-radius: inherit;
          background: var(--card-gradient);
        }

        .card-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 10px;
          line-height: 12px;
          font-weight: 600;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 4px 7px;
          font-size: 9px;
          line-height: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .status-pill.healthy {
          background: rgba(28,154,102,0.10);
          color: #1e7b52;
        }

        .status-pill.watch {
          background: rgba(208,127,24,0.10);
          color: #a65f0d;
        }

        .status-pill.low {
          background: rgba(216,93,93,0.10);
          color: #b14e4e;
        }

        .catalog-list {
          display: grid;
          gap: 10px;
        }

        .skeleton-row {
          overflow: hidden;
          position: relative;
        }

        .skeleton {
          position: relative;
          display: block;
          overflow: hidden;
          background: rgba(120, 100, 80, 0.08);
          border-radius: 999px;
        }

        .skeleton::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%);
          animation: shimmerSweep 1.4s linear infinite;
        }

        .skeleton-main,
        .skeleton-side {
          display: grid;
          gap: 10px;
          flex: 1;
        }

        .skeleton-side {
          width: 100px;
          justify-items: end;
        }

        .skeleton-line {
          height: 14px;
        }

        .skeleton-line-lg { width: 78%; }
        .skeleton-line-sm { width: 52%; }
        .skeleton-line-md { width: 72%; }
        .skeleton-line-xs { width: 48%; }

        .catalog-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
          border-radius: var(--r-lg);
          border: 1px solid rgba(97,72,50,0.09);
          background: rgba(255,255,255,0.52);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: background 120ms ease, border-color 120ms ease, transform 120ms ease;
          animation: rowIn 240ms cubic-bezier(0.16,1,0.3,1) both;
        }

        .catalog-row:hover {
          background: rgba(255,255,255,0.68);
          border-color: rgba(97,72,50,0.16);
          transform: translateY(-1px);
        }

        .item-main {
          min-width: 0;
          flex: 1;
        }

        .product-name {
          margin: 0;
          color: var(--text-primary);
          font-size: 15px;
          line-height: 23px;
          font-weight: 500;
          letter-spacing: 0;
        }

        .meta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          color: var(--text-tertiary);
          font-size: 11px;
          line-height: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .price-row {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin: 8px 0 0;
          color: var(--text-secondary);
          font-size: 12px;
          line-height: 18px;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
        }

        .category-pill {
          display: inline-flex;
          align-items: center;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 11px;
          line-height: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.48);
        }

        .category-oil { background: rgba(243,180,76,0.12); color: #8d5b0d; border-color: rgba(243,180,76,0.24); }
        .category-grain { background: rgba(28,154,102,0.1); color: #186d4b; border-color: rgba(28,154,102,0.18); }
        .category-snack { background: rgba(230,78,125,0.09); color: #9d305d; border-color: rgba(230,78,125,0.18); }
        .category-dairy { background: rgba(107,71,214,0.08); color: #4d3a8d; border-color: rgba(107,71,214,0.18); }
        .category-beverage { background: rgba(240,122,58,0.09); color: #a8571d; border-color: rgba(240,122,58,0.18); }
        .category-default { background: rgba(255,255,255,0.5); color: var(--text-secondary); border-color: var(--border-subtle); }

        .item-side {
          text-align: right;
        }

        .stock-row {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin: 0;
          font-size: 16px;
          line-height: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }

        .stock-label {
          color: var(--text-tertiary);
          font-size: 10px;
          line-height: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .stock-value {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: inherit;
        }

        .stock-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }

        .stock-good { color: var(--success); }
        .stock-warning { color: var(--warning); }
        .stock-danger { color: var(--danger); }

        @keyframes rowIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmerSweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        @media (max-width: 560px) {
          .catalog-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .item-side {
            width: 100%;
            text-align: left;
          }

          .price-row, .stock-row {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
