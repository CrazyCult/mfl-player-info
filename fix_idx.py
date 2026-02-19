content = open("src/components/Player/index.tsx", "r", encoding="utf-8").read()
old = "<ShareCardButton targetId='player-share-card' />"
new = "<ShareCardButton playerId={player.id} />"
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/index.tsx", "w", encoding="utf-8").write(result)
