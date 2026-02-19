content = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()

# Ajouter preferredFoot dans le destructuring
old1 = "const { firstName, lastName, overall, positions, pace, shooting, passing, dribbling, defense, physical, age, height } = player.metadata;"
new1 = "const { firstName, lastName, overall, positions, pace, shooting, passing, dribbling, defense, physical, age, height, preferredFoot } = player.metadata;"

# Ajouter FOOT dans les infos
old2 = '[["AGE", age + " yrs"], ["HEIGHT", (height || "-") + " cm"], ["POSITION", positions.join(" / ")]].map'
new2 = '[["AGE", age + " yrs"], ["HEIGHT", (height || "-") + " cm"], ["FOOT", preferredFoot || "-"], ["POSITION", positions.join(" / ")]].map'

# Ordre positions : primaire d abord puis SF/FF
old3 = "const allPositions = [\"GK\",\"CB\",\"RB\",\"LB\",\"RWB\",\"LWB\",\"CDM\",\"CM\",\"CAM\",\"RM\",\"LM\",\"RW\",\"LW\",\"CF\",\"ST\"];"
new3 = """const allPositions = ["GK","CB","RB","LB","RWB","LWB","CDM","CM","CAM","RM","LM","RW","LW","CF","ST"];
  // Trier: primaire, secondaire, FF(-5), SF(-8)
  const sortOrder = (p: string) => {
    if (positions[0] === p) return 0;
    if (positions.slice(1).includes(p)) return 1;
    const adj = familiarity?.adjustment[p as keyof typeof familiarity.adjustment];
    if (adj === -5) return 2;
    if (adj === -8) return 3;
    return 99;
  };"""

# Ajouter .sort apres le .map
old4 = "return { pos: p, badge, badgeColor, rating, diff };\n    });"
new4 = "return { pos: p, badge, badgeColor, rating, diff };\n    }).sort((a, b) => sortOrder(a.pos) - sortOrder(b.pos));"

# Lignes plus marquees
old5 = 'borderBottom: i < posRatings.length - 1 ? "1px solid #f1f5f9" : "none",'
new5 = 'borderBottom: i < posRatings.length - 1 ? "1px solid #e2e8f0" : "none",'

result = content.replace(old1, new1).replace(old2, new2).replace(old3, new3).replace(old4, new4).replace(old5, new5)
print("OK" if result != content else "NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result)
