content = open("src/components/Player/ImageCard.tsx", "r", encoding="utf-8").read()
old = "players/${player.id}/card_512.png"
new = "players/v2/${player.id}/card.png"
result = content.replace(old, new)
print("Match found!" if result != content else "NO MATCH")
open("src/components/Player/ImageCard.tsx", "w", encoding="utf-8").write(result)
