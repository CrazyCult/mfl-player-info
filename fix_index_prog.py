content = open("src/components/Player/index.tsx", "r", encoding="utf-8").read()
old = "import { ShareCardButton } from './ShareCardButton';"
new = "import { ShareCardButton } from './ShareCardButton';\nimport { PlayerProgression } from './PlayerProgression';"
old2 = "      <Suspense\n        fallback={\n          <div className='flex justify-center py-8'>\n            <SpinnerIcon className='text-muted size-6 animate-spin' />\n          </div>\n        }\n      >\n        <ContractStats player={player} />\n      </Suspense>"
new2 = "      <PlayerProgression player={player} />\n      <ContractStats player={player} />"
result = content.replace(old, new).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/index.tsx", "w", encoding="utf-8").write(result)
