content = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()
old = "const { firstName, lastName, overall, positions, pace, shooting, passing, dribbling, defense, physical, age, height, foot } = player.metadata;"
new = "const { firstName, lastName, overall, positions, pace, shooting, passing, dribbling, defense, physical, age, height } = player.metadata;"
old2 = '["FOOT", foot || "-"],'
new2 = ''
result = content.replace(old, new).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result)
