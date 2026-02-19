content = open("src/components/Player/BasicInfo.tsx", "r", encoding="utf-8").read()
old = "  const { firstName, lastName, age, height, preferredFoot, positions } =\n    player.metadata;"
new = "  const { firstName, lastName, age, height, preferredFoot, positions, retirementYears } =\n    player.metadata;"
old2 = "        age,"
new2 = """        age: retirementYears ? (
          <span className='flex items-center justify-end gap-2'>
            {age}
            <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold ${
              retirementYears === 1 ? 'bg-red-500 text-white' :
              retirementYears === 2 ? 'bg-orange-400 text-white' :
              'bg-yellow-400 text-yellow-900'
            }`}>
              {retirementYears === 1 ? 'RETIRING' : retirementYears === 2 ? 'PRE-RETIRE' : 'LATE CAREER'}
            </span>
          </span>
        ) : age,"""
result = content.replace(old, new).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/BasicInfo.tsx", "w", encoding="utf-8").write(result)
