content = open("src/components/Player/MarketValue.tsx", "r", encoding="utf-8").read()
old1 = "className='flex flex-col gap-1 max-h-48 overflow-y-auto'"
new1 = "className='flex flex-col gap-1'"
old2 = ".slice(0, 15).map"
new2 = ".slice(0, 12).map"
result = content.replace(old1, new1).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/MarketValue.tsx", "w", encoding="utf-8").write(result)
