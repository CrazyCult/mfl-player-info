content = open("src/components/Player/PositionRatings.tsx", "r", encoding="utf-8").read()
old1 = "[stat]: +stats[stat] + 1,"
new1 = "[stat]: +(stats[stat] ?? 0) + 1,"
old2 = "[stat]: +stats[stat] - 1,"
new2 = "[stat]: +(stats[stat] ?? 0) - 1,"
result = content.replace(old1, new1).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/PositionRatings.tsx", "w", encoding="utf-8").write(result)
