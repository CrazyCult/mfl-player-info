content = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()

# Tri par rating décroissant
old1 = ".sort((a, b) => sortOrder(a.pos) - sortOrder(b.pos));"
new1 = ".sort((a, b) => b.rating - a.rating);"

# Couleur diff positive en vert
old2 = 'color: diff < 0 ? "#ef4444" : "#94a3b8", fontWeight: 600, width: "28px", textAlign: "right"'
new2 = 'color: diff < 0 ? "#ef4444" : diff > 0 ? "#16a34a" : "#94a3b8", fontWeight: 700, width: "28px", textAlign: "right"'

result = content.replace(old1, new1).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result)
