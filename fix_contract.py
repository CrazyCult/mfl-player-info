content = open("src/components/Player/ContractStats.tsx", "r", encoding="utf-8").read()
old = "limit=200&ageMin=${player.metadata.age - 1}&ageMax=${player.metadata.age + 1}&overallMin=${player.metadata.overall - 1}&overallMax=${player.metadata.overall + 1}&positions=${player.metadata.positions[0]}&excludingMflOwned=true&isFreeAgent=false"
new = "limit=500&ageMin=${player.metadata.age - 2}&ageMax=${player.metadata.age + 2}&overallMin=${player.metadata.overall - 2}&overallMax=${player.metadata.overall + 2}&positions=${player.metadata.positions[0]}&excludingMflOwned=true&isFreeAgent=false"
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/ContractStats.tsx", "w", encoding="utf-8").write(result)
