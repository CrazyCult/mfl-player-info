content = open("src/components/Player/index.tsx", "r", encoding="utf-8").read()

old = "import type { Player } from '@/types/global.types';"
new = "import type { Player } from '@/types/global.types';\nimport { ShareCardButton } from './ShareCardButton';"
content = content.replace(old, new)

old2 = "    <div className='bg-card shadow-foreground/5 outline-border @container/main mx-auto w-full max-w-xl transform rounded-xl p-4 shadow-2xl outline-1 -outline-offset-1 sm:p-6 lg:p-8'>"
new2 = "    <div id='player-share-card' className='bg-card shadow-foreground/5 outline-border @container/main mx-auto w-full max-w-xl transform rounded-xl p-4 shadow-2xl outline-1 -outline-offset-1 sm:p-6 lg:p-8'>"
content = content.replace(old2, new2)

old3 = "      <ContractStats player={player} />"
new3 = "      <ContractStats player={player} />\n      <div className='mt-6 flex justify-end'>\n        <ShareCardButton targetId='player-share-card' />\n      </div>"
content = content.replace(old3, new3)

print("OK" if "ShareCardButton" in content else "FAIL")
open("src/components/Player/index.tsx", "w", encoding="utf-8").write(content)
