content = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()
old = 'mflplayer.info/player/{id}'
new = 'mflplayerinfo.vercel.app/player/{id}'
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result)
