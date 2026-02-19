content = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()
old = "const { firstName, lastName, overall, positions, pace, shooting, passing, dribbling, defense, physical, age, height, preferredFoot } = player.metadata;"
new = "const { firstName, lastName, overall, positions, pace, shooting, passing, dribbling, defense, physical, age, height, preferredFoot, retirementYears } = player.metadata;"

# Badge retraite dans les infos
old2 = '["AGE", age + " yrs"],'
new2 = '["AGE", age + " yrs" + (retirementYears === 1 ? " RETIRING" : retirementYears === 2 ? " PRE-RETIRE" : retirementYears === 3 ? " LATE CAREER" : "")],'

result = content.replace(old, new).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result)
