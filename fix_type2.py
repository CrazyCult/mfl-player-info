content = open("src/types/global.types.ts", "r", encoding="utf-8").read()
old = "  goalkeeping: string;\n  ageAtMint: string;"
new = "  goalkeeping: string;\n  retirementYears?: number;\n  ageAtMint: string;"
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/types/global.types.ts", "w", encoding="utf-8").write(result)
