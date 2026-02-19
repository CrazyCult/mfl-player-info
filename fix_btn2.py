content = open("src/components/Player/ShareCardButton.tsx", "r", encoding="utf-8").read()
old = '      {copied ? "Copie !" : loading ? "..." : "Copier fiche"}'
new = ''
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/ShareCardButton.tsx", "w", encoding="utf-8").write(result)
