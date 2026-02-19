content = open("src/components/Player/ShareCardButton.tsx", "r", encoding="utf-8").read()
old = 'title="Copier la fiche en PNG"'
new = 'title="Copy player card as PNG"'
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/ShareCardButton.tsx", "w", encoding="utf-8").write(result)
