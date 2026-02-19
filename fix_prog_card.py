content = open("src/components/Player/PlayerProgression.tsx", "r", encoding="utf-8").read()

# Plus d espace entre titre et graphique
old1 = "          <div className='border-border rounded-lg border p-4'>"
new1 = "          <div className='border-border rounded-lg border p-6'>"

# Lignes de grille plus visibles
old2 = "stroke='currentColor' strokeOpacity='0.1' strokeWidth='1'"
new2 = "stroke='currentColor' strokeOpacity='0.25' strokeWidth='1'"

# Decaler les labels age en bas pour eviter chevauchement avec la courbe
old3 = "<text x={toX(d.age)} y={H - 1} fontSize='9' fill='currentColor' opacity='0.5' textAnchor='middle' className='text-foreground'>{d.age}</text>"
new3 = "<text x={toX(d.age)} y={H + 10} fontSize='9' fill='currentColor' opacity='0.6' textAnchor='middle' className='text-foreground'>{d.age}</text>"

# Augmenter padding pour avoir plus d espace haut et bas
old4 = "const W = 500, H = 120, PAD = 8;"
new4 = "const W = 500, H = 110, PAD = 16;"

result = content.replace(old1, new1).replace(old2, new2).replace(old3, new3).replace(old4, new4)
print("Progression OK" if result != content else "NO MATCH")
open("src/components/Player/PlayerProgression.tsx", "w", encoding="utf-8").write(result)

# Badge retraite couleurs sur la carte - le texte age inclut maintenant le label
# On va plutot ajouter une vraie couleur dans la carte
content2 = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()
old5 = '["AGE", age + " yrs" + (retirementYears === 1 ? " RETIRING" : retirementYears === 2 ? " PRE-RETIRE" : retirementYears === 3 ? " LATE CAREER" : "")],'
new5 = '["AGE", age + " yrs"],'
result2 = content2.replace(old5, new5)

# Remplacer la section AGE par une version avec badge couleur
old6 = '{[["AGE", age + " yrs"], ["HEIGHT", (height || "-") + " cm"], ["FOOT", preferredFoot || "-"], ["POSITION", positions.join(" / ")]].map(([k, v]) => ('
new6 = '''{[["HEIGHT", (height || "-") + " cm"], ["FOOT", preferredFoot || "-"], ["POSITION", positions.join(" / ")]].map(([k, v]) => ('''

# Ajouter la ligne AGE avec badge avant le map
old7 = '''        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>'''
new7 = '''        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "8px", justifyContent: "space-between", borderBottom: "2px solid #cbd5e1", paddingBottom: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569" }}>AGE</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{age} yrs</span>
              {retirementYears && <span style={{ fontSize: "10px", fontWeight: 800, background: retirementYears === 1 ? "#ef4444" : retirementYears === 2 ? "#f97316" : "#eab308", color: retirementYears === 3 ? "#713f12" : "#fff", padding: "2px 6px", borderRadius: "3px" }}>{retirementYears === 1 ? "RETIRING" : retirementYears === 2 ? "PRE-RETIRE" : "LATE CAREER"}</span>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>'''
result2 = result2.replace(old5, new5).replace(old6, new6).replace(old7, new7)
print("Card retire OK" if result2 != content2 else "Card NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result2)
