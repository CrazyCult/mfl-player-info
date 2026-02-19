content = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()

# Info labels plus foncés et grands
old1 = '"fontSize": "10px", "fontWeight": 700, "color": "#94a3b8", "letterSpacing": "0.08em"'
new1 = '"fontSize": "11px", "fontWeight": 700, "color": "#64748b", "letterSpacing": "0.08em"'

# Valeurs infos plus foncées
old2 = '"fontSize": "11px", "fontWeight": 600, "color": "#334155"'
new2 = '"fontSize": "12px", "fontWeight": 700, "color": "#0f172a"'

# Labels stats plus grands
old3 = '"fontSize": "10px", "fontWeight": 700, "color": "#94a3b8", "letterSpacing": "0.06em"'
new3 = '"fontSize": "11px", "fontWeight": 700, "color": "#475569", "letterSpacing": "0.06em"'

result = content.replace(old1, new1).replace(old2, new2).replace(old3, new3)
print("OK" if result != content else "NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result)
