content = open("src/components/Player/ContractStats.tsx", "r", encoding="utf-8").read()

# Ordre divisions : 10 (Flint) en bas, 1 (Diamond) en haut
old1 = "      const sorted = new Map([...grouped.entries()].sort());"
new1 = """      const divOrder = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
      const sorted = new Map([...grouped.entries()].sort((a, b) => divOrder.indexOf(a[0]) - divOrder.indexOf(b[0])));"""

# Exclusion des extremes (trim 10% haut et bas) + recalcul avg sans extremes
old2 = """        const s = [...contracts].sort((a: Player, b: Player) => a.activeContract!.revenueShare - b.activeContract!.revenueShare);
        info.push({
          division,
          total: contracts.length,
          minRevenueShare: s[0].activeContract.revenueShare,
          maxRevenueShare: s[s.length - 1].activeContract.revenueShare,
          averageRevenueShare: contracts.reduce((sum: number, c: Player) => sum + c.activeContract!.revenueShare, 0) / contracts.length,
        });"""
new2 = """        const s = [...contracts].sort((a: Player, b: Player) => a.activeContract!.revenueShare - b.activeContract!.revenueShare);
        const trim = Math.max(1, Math.floor(s.length * 0.1));
        const trimmed = s.length >= 5 ? s.slice(trim, s.length - trim) : s;
        const avg = trimmed.reduce((sum: number, c: Player) => sum + c.activeContract!.revenueShare, 0) / trimmed.length;
        info.push({
          division,
          total: contracts.length,
          minRevenueShare: trimmed[0].activeContract.revenueShare,
          maxRevenueShare: trimmed[trimmed.length - 1].activeContract.revenueShare,
          averageRevenueShare: avg,
        });"""

result = content.replace(old1, new1).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/ContractStats.tsx", "w", encoding="utf-8").write(result)
