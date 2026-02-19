content = open("src/components/Player/PositionRatings.tsx", "r", encoding="utf-8").read()
old1 = "if (stats[stat] < 99) {"
new1 = "if ((stats[stat] ?? 0) < 99) {"
old2 = "if (stats[stat] > 0 && stats[stat] > defaultPlayerStats[stat]) {"
new2 = "if ((stats[stat] ?? 0) > 0 && (stats[stat] ?? 0) > (defaultPlayerStats[stat] ?? 0)) {"
result = content.replace(old1, new1).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/PositionRatings.tsx", "w", encoding="utf-8").write(result)
