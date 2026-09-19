import re

def extract_kirana_item(text: str) -> dict:
    """
    Offline heuristic extractor for Hindi / Hinglish grocery terms.
    Later, this is where Amazon Bedrock Claude 3.5 Sonnet hooks in.
    """
    clean_text = text.lower()

    # 1. Price detection (e.g., '28 rupaye', 'rs 140', '₹50')
    price_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:rupaye|rs|inr|₹|ka)', clean_text)
    mrp = float(price_match.group(1)) if price_match else 50.0

    # 2. Stock quantity detection (e.g., '10 packet', '20 bache', '5 piece')
    stock_match = re.search(r'(\d+)\s*(?:packet|piece|pcs|bache|boxes|nag)', clean_text)
    stock = int(stock_match.group(1)) if stock_match else 10

    # 3. Unit size detection (e.g., '1 kilo', '500 gram', '1 litre', '1l')
    unit_match = re.search(r'(\d+\s*(?:kilo|kg|gram|g|l|litre|ml))', clean_text)
    unit = unit_match.group(1) if unit_match else "1 unit"

    # 4. Brand & category heuristics
    if any(k in clean_text for k in ["salt", "namak", "tata"]):
        name = "Tata Salt (Vacuum Evaporated)"
        category = "Staples"
    elif any(k in clean_text for k in ["atta", "aashirvaad", "gehu"]):
        name = "Aashirvaad Shudh Chakki Atta"
        category = "Flour"
    elif any(k in clean_text for k in ["maggi", "noodles"]):
        name = "Nestle Maggi 2-Minute Noodles"
        category = "Snacks"
    elif any(k in clean_text for k in ["oil", "tel", "fortune", "sunflower"]):
        name = "Fortune Sunlite Sunflower Oil"
        category = "Cooking Oil"
    elif any(k in clean_text for k in ["parle", "biscuit"]):
        name = "Parle-G Gold Biscuits"
        category = "Biscuits & Cookies"
    else:
        name = " ".join([w.capitalize() for w in text.split()[:3]]) or "Kirana Item"
        category = "General Grocery"

    return {
        "product_name": name,
        "category": category,
        "unit_quantity": unit,
        "mrp_inr": mrp,
        "stock_quantity": stock,
    }