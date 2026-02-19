content = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()
old = "{ width: 600, height: 720 }"
new = "{ width: 600, height: 800 }"
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result)
