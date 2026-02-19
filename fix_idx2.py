content = open("src/components/Player/index.tsx", "r", encoding="utf-8").read()
old = """      <div className='mt-6 flex justify-end'>
        <ShareCardButton playerId={player.id} />
      </div>"""
new = ""
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/index.tsx", "w", encoding="utf-8").write(result)
