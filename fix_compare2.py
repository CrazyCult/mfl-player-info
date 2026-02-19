content = open("src/components/Compare/PlayerStatsComparison.tsx", "r", encoding="utf-8").read()
old = "{player1Stats[stat as StatKey] >\n                  player2Stats[stat as StatKey] && ("
new = "{(player1Stats[stat as StatKey] ?? 0) >\n                  (player2Stats[stat as StatKey] ?? 0) && ("
old2 = "{player2Stats[stat as StatKey] >\n                  player1Stats[stat as StatKey] && ("
new2 = "{(player2Stats[stat as StatKey] ?? 0) >\n                  (player1Stats[stat as StatKey] ?? 0) && ("
result = content.replace(old, new).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/components/Compare/PlayerStatsComparison.tsx", "w", encoding="utf-8").write(result)
