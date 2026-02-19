content = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()
old = '{[["HEIGHT", (height || "-") + " cm"], ["FOOT", preferredFoot || "-"], ["POSITION", positions.join(" / ")]].map(([k, v]) => ('
new = '{[["AGE", age + " yrs" + (retirementYears === 1 ? " - RETIRING" : retirementYears === 2 ? " - PRE-RETIRE" : retirementYears === 3 ? " - LATE CAREER" : "")], ["HEIGHT", (height || "-") + " cm"], ["FOOT", preferredFoot || "-"], ["POSITION", positions.join(" / ")]].map(([k, v]) => ('
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result)
