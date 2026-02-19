content = open("src/types/global.types.ts", "r", encoding="utf-8").read()
old = "  goalkeeping: number;"
new = "  goalkeeping: number;\n  retirementYears?: number;"
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/types/global.types.ts", "w", encoding="utf-8").write(result)
