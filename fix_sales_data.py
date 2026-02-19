# Ajouter sales dans MarketValueResult
content = open("src/services/market-value.ts", "r", encoding="utf-8").read()
old = "  // Detailed breakdown (for debugging/advanced users)\n  breakdown: {"
new = "  // Raw sales data for tooltip\n  sales?: { price: number; date: number; age?: number; overall?: number }[];\n\n  // Detailed breakdown (for debugging/advanced users)\n  breakdown: {"
result = content.replace(old, new)
print("MarketValueResult OK" if result != content else "NO MATCH 1")

# Ajouter sales dans calculateWithEMA
old2 = "    basedOn: `${marketData.sampleSize} sales over last ${Math.ceil(emaResult.oldestSale)} days (${marketData.searchCriteria})`,"
new2 = """    basedOn: `${marketData.sampleSize} sales over last ${Math.ceil(emaResult.oldestSale)} days (${marketData.searchCriteria})`,
    sales: marketData.sales.map(s => ({
      price: s.price,
      date: s.purchaseDateTime || 0,
      age: s.player?.metadata?.age,
      overall: s.player?.metadata?.overall,
    })),"""
result = result.replace(old2, new2)
print("EMA sales OK" if "sales: marketData.sales" in result else "NO MATCH 2")

# Ajouter sales dans calculateWithStatistics
old3 = "    basedOn: `${marketData.sampleSize} sales (${marketData.searchCriteria})`,"
new3 = """    basedOn: `${marketData.sampleSize} sales (${marketData.searchCriteria})`,
    sales: marketData.sales.map(s => ({
      price: s.price,
      date: s.purchaseDateTime || 0,
      age: s.player?.metadata?.age,
      overall: s.player?.metadata?.overall,
    })),"""
result = result.replace(old3, new3)
print("Stats sales OK" if result.count("sales: marketData.sales") == 2 else "NO MATCH 3")

open("src/services/market-value.ts", "w", encoding="utf-8").write(result)
