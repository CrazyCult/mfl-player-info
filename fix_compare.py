content = open("src/components/Compare/PlayerStatsComparison.tsx", "r", encoding="utf-8").read()
old1 = "rating={player1Stats[stat as StatKey]}"
new1 = "rating={player1Stats[stat as StatKey] ?? 0}"
old2 = "rating={player2Stats[stat as StatKey]}"
new2 = "rating={player2Stats[stat as StatKey] ?? 0}"
result = content.replace(old1, new1).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/components/Compare/PlayerStatsComparison.tsx", "w", encoding="utf-8").write(result)
