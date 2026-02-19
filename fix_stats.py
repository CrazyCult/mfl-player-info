content = open("src/components/Player/PlayerStats.tsx", "r", encoding="utf-8").read()
old = "const diff = val - player.metadata[key as StatKey];"
new = "const diff = val - (player.metadata[key as StatKey] ?? 0);"
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/PlayerStats.tsx", "w", encoding="utf-8").write(result)
