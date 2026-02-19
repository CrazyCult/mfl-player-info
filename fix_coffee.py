content = open("src/components/Footer/index.tsx", "r", encoding="utf-8").read()
old = "href='https://www.buymeacoffee.com'"
new = "href='https://buymeacoffee.com/alicoleman170'"
result = content.replace(old, new)
print("Match!" if result != content else "NO MATCH")
open("src/components/Footer/index.tsx", "w", encoding="utf-8").write(result)
