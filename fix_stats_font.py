content = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()
old1 = 'fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em"'
new1 = 'fontSize: "13px", fontWeight: 800, color: "#334155", letterSpacing: "0.06em"'
result = content.replace(old1, new1)
print("OK" if result != content else "NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result)
