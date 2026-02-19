content = open("src/components/Player/ContractStats.tsx", "r", encoding="utf-8").read()
old = "const divOrder = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];"
new = "const divOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];"
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/ContractStats.tsx", "w", encoding="utf-8").write(result)
