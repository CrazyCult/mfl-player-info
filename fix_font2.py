content = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()

# Labels infos (AGE, HEIGHT, POSITION) plus grands et foncés
old1 = 'fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em"'
new1 = 'fontSize: "12px", fontWeight: 700, color: "#475569", letterSpacing: "0.08em"'

# Valeurs infos plus grandes et foncées
old2 = 'fontSize: "11px", fontWeight: 600, color: "#334155"'
new2 = 'fontSize: "13px", fontWeight: 700, color: "#0f172a"'

# Footer plus visible
old3 = 'fontSize: "10px", color: "#cbd5e1", letterSpacing: "0.05em"'
new3 = 'fontSize: "11px", color: "#94a3b8", letterSpacing: "0.05em"'
old4 = 'fontSize: "10px", color: "#cbd5e1"'
new4 = 'fontSize: "11px", color: "#94a3b8"'

result = content.replace(old1, new1).replace(old2, new2).replace(old3, new3).replace(old4, new4)
print("OK" if result != content else "NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result)
