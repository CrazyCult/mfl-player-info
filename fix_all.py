# 1. Footer - inverser ordre
content = open("src/components/Footer/index.tsx", "r", encoding="utf-8").read()
old = "Motherforked by{' '}\n        <a href='https://github.com/CrazyCult' target='_blank' className='text-muted-foreground/80 hover:text-muted-foreground/70'>CrazyCult</a>\n        {' '}&middot;{' '}Built by"
new = "Built by"
old2 = "        @AliColeman170\n        </Link>"
new2 = "        @AliColeman170\n        </Link>\n        {' '}&middot;{' '}Motherforked by{' '}\n        <a href='https://github.com/CrazyCult' target='_blank' className='text-muted-foreground/80 hover:text-muted-foreground/70'>CrazyCult</a>"
result = content.replace(old, new).replace(old2, new2)
print("Footer OK" if result != content else "Footer NO MATCH")
open("src/components/Footer/index.tsx", "w", encoding="utf-8").write(result)

# 2. Progression - ajouter use client en ligne 1
content2 = open("src/components/Player/PlayerProgression.tsx", "r", encoding="utf-8").read()
if not content2.startswith("'use client'"):
    content2 = "'use client';\n" + content2
    open("src/components/Player/PlayerProgression.tsx", "w", encoding="utf-8").write(content2)
    print("Progression OK")
else:
    print("Progression already has use client")

# 3. Badge retraite - verifier et fixer
content3 = open("src/components/Player/BasicInfo.tsx", "r", encoding="utf-8").read()
old3 = "    age,"
new3 = """    age: retirementYears ? (
          <span className='flex items-center justify-end gap-2'>
            <span>{age}</span>
            <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold ${
              retirementYears === 1 ? 'bg-red-500 text-white' :
              retirementYears === 2 ? 'bg-orange-400 text-white' :
              'bg-yellow-400 text-yellow-900'
            }`}>
              {retirementYears === 1 ? 'RETIRING' : retirementYears === 2 ? 'PRE-RETIRE' : 'LATE CAREER'}
            </span>
          </span>
        ) : age,"""
result3 = content3.replace(old3, new3)
print("Badge OK" if result3 != content3 else "Badge NO MATCH")
open("src/components/Player/BasicInfo.tsx", "w", encoding="utf-8").write(result3)

# 4. Diff positif avec + dans position ratings de la carte
content4 = open("src/app/api/player-card/route.tsx", "r", encoding="utf-8").read()
old4 = '{diff === 0 ? "0" : diff}'
new4 = '{diff === 0 ? "0" : diff > 0 ? "+" + diff : diff}'
result4 = content4.replace(old4, new4)
print("Diff OK" if result4 != content4 else "Diff NO MATCH")
open("src/app/api/player-card/route.tsx", "w", encoding="utf-8").write(result4)
