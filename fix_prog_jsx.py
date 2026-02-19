content = open("src/components/Player/index.tsx", "r", encoding="utf-8").read()
old = "      <PlayerProgression player={player} />\n      <ContractStats player={player} />"
new_val = "NO"
if "PlayerProgression player" in content:
    print("already in JSX")
else:
    old2 = "      <ContractStats player={player} />"
    new2 = "      <PlayerProgression player={player} />\n      <ContractStats player={player} />"
    result = content.replace(old2, new2)
    print("OK" if result != content else "NO MATCH")
    open("src/components/Player/index.tsx", "w", encoding="utf-8").write(result)
