import React from "react";
import {
  Check,
  Plus,
  Minus,
  IndianRupee,
  Package,
  Tag,
  Scale,
  Boxes,
  Sparkles,
  X,
} from "lucide-react";

export default function ReviewCard({ item, onChange, onSave, onCancel }) {
  if (!item) return null;

  const handleStockChange = (delta) => {
    const currentStock = parseInt(item.stock_quantity) || 0;
    onChange({ ...item, stock_quantity: Math.max(0, currentStock + delta) });
  };

  const quickCategories = [
    "Cooking Oil",
    "Flour",
    "Staples",
    "Snacks",
    "Biscuits",
    "Dairy",
    "Beverages",
  ];

  return (
    <div className="bg-gradient-to-b from-amber-50/90 to-orange-50/50 border border-amber-300/80 rounded-2xl p-6 mb-6 shadow-md transition-all animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Top Banner with AI Confidence Indicator */}
      <div className="flex justify-between items-center pb-3 mb-4 border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full shadow-xs">
            <Check size={16} strokeWidth={3} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-amber-950 tracking-wide uppercase">
                AI Extracted Item
              </h2>
              <span className="inline-flex items-center gap-1 bg-amber-100/90 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                <Sparkles size={11} /> High Accuracy
              </span>
            </div>
            <p className="text-[11px] text-amber-800/80">
              Kripya janch lein aur zaroorat ho to badal lein (Review & verify
              before saving)
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Cancel extraction"
        >
          <X size={15} /> Cancel
        </button>
      </div>

      {/* Grid of Dedicated, Explicitly Labeled Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Field 1: Product Name */}
        <div className="bg-white/80 p-3 rounded-xl border border-amber-200/70 shadow-xs focus-within:ring-2 focus-within:ring-orange-400">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
            <Package size={14} className="text-orange-500" />
            <span>Product Name</span>
            <span className="text-[10px] font-normal text-slate-400">
              (Item ka Naam)
            </span>
          </label>
          <input
            type="text"
            value={item.product_name || ""}
            onChange={(e) =>
              onChange({ ...item, product_name: e.target.value })
            }
            placeholder="e.g. Fortune Sunlite Sunflower Oil"
            className="w-full bg-transparent border-0 px-1 py-1 text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-300"
          />
        </div>

        {/* Field 2: Category */}
        <div className="bg-white/80 p-3 rounded-xl border border-amber-200/70 shadow-xs focus-within:ring-2 focus-within:ring-orange-400">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
            <Tag size={14} className="text-amber-600" />
            <span>Category</span>
            <span className="text-[10px] font-normal text-slate-400">
              (Varg/Shreni)
            </span>
          </label>
          <input
            type="text"
            value={item.category || ""}
            onChange={(e) => onChange({ ...item, category: e.target.value })}
            placeholder="e.g. Cooking Oil"
            className="w-full bg-transparent border-0 px-1 py-1 text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-300"
          />
        </div>

        {/* Field 3: Unit / Weight */}
        <div className="bg-white/80 p-3 rounded-xl border border-amber-200/70 shadow-xs focus-within:ring-2 focus-within:ring-orange-400">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
            <Scale size={14} className="text-blue-500" />
            <span>Unit / Weight</span>
            <span className="text-[10px] font-normal text-slate-400">
              (Vajan / Maap)
            </span>
          </label>
          <input
            type="text"
            value={item.unit_quantity || ""}
            onChange={(e) =>
              onChange({ ...item, unit_quantity: e.target.value })
            }
            placeholder="e.g. 1 Litre, 500g, 1 Pack"
            className="w-full bg-transparent border-0 px-1 py-1 text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-300"
          />
        </div>

        {/* Field 4: Pricing & Stock (Separated into Dedicated Columns with Steppers) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Price */}
          <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/70 shadow-xs focus-within:ring-2 focus-within:ring-orange-400">
            <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-0.5">
              <IndianRupee size={12} className="text-emerald-600" />
              <span>MRP (₹)</span>
            </label>
            <div className="flex items-center">
              <span className="text-slate-400 text-xs font-bold mr-0.5">₹</span>
              <input
                type="number"
                value={item.mrp_inr ?? ""}
                onChange={(e) =>
                  onChange({
                    ...item,
                    mrp_inr: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
                className="w-full bg-transparent border-0 py-1 text-sm font-bold text-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Stock with Steppers */}
          <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/70 shadow-xs">
            <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-0.5">
              <Boxes size={12} className="text-orange-500" />
              <span>Stock (Qty)</span>
            </label>
            <div className="flex items-center justify-between mt-0.5">
              <button
                type="button"
                onClick={() => handleStockChange(-1)}
                className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold text-xs"
              >
                <Minus size={10} />
              </button>
              <input
                type="number"
                value={item.stock_quantity ?? ""}
                onChange={(e) =>
                  onChange({
                    ...item,
                    stock_quantity: parseInt(e.target.value) || 0,
                  })
                }
                className="w-8 text-center bg-transparent border-0 text-sm font-bold text-orange-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleStockChange(1)}
                className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold text-xs"
              >
                <Plus size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Category Chips */}
      <div className="flex items-center gap-1.5 flex-wrap mb-5 px-1">
        <span className="text-[11px] font-semibold text-amber-900/70 mr-1">
          Quick Tag:
        </span>
        {quickCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onChange({ ...item, category: cat })}
            className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-all ${
              item.category === cat
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "bg-white/90 text-amber-900 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Action Button */}
      <button
        onClick={onSave}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <Plus size={18} strokeWidth={2.5} /> Add to Live Inventory (Dukaan
        Catalog Me Jodein)
      </button>
    </div>
  );
}
