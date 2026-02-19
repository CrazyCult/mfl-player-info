content = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()

# Lignes dans position ratings
old1 = 'borderBottom: i < posRatings.length - 1 ? "1px solid #e2e8f0" : "none",'
new1 = 'borderBottom: i < posRatings.length - 1 ? "2px solid #cbd5e1" : "none",'

# Lignes dans les infos AGE/HEIGHT/FOOT/POSITION
old2 = 'borderBottom: "1px solid #e2e8f0", paddingBottom: "4px"'
new2 = 'borderBottom: "2px solid #cbd5e1", paddingBottom: "4px"'

result = content.replace(old1, new1).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result)
