content = open("src/data/listings.ts", "r", encoding="utf-8").read()

# Exclusion des outliers >50% de l ecart par rapport a la mediane
old = """    # Sort by purchase date (most recent first) and limit results
    const sortedSales = sales
      .filter(sale => sale.purchaseDateTime)
      .sort((a, b) => (b.purchaseDateTime || 0) - (a.purchaseDateTime || 0))
      .slice(0, maxResults);"""
new = """    // Sort by purchase date (most recent first)
    const rawSales = sales
      .filter(sale => sale.purchaseDateTime)
      .sort((a, b) => (b.purchaseDateTime || 0) - (a.purchaseDateTime || 0));

    // Exclure les outliers >50% de la mediane
    const prices = rawSales.map(s => s.price).sort((a, b) => a - b);
    const median = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0;
    const sortedSales = median > 0
      ? rawSales.filter(s => Math.abs(s.price - median) / median <= 0.5)
      : rawSales;"""

result = content.replace(old, new)
print("OK" if result != content else "NO MATCH - trying exact match")
if result == content:
    # Chercher la vraie chaine
    idx = content.find("Sort by purchase date")
    print(repr(content[idx-4:idx+200]))
open("src/data/listings.ts", "w", encoding="utf-8").write(result)
