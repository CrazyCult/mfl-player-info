content = open("src/components/Search/SearchComboBox.tsx", "r", encoding="utf-8").read()
old = "const router = useRouter();"
new = "const router = useRouter();\n  const prefetch = (id: number) => router.prefetch(`/player/${id}`);"
result = content.replace(old, new)
old2 = "<ComboboxOption\n                key={option.id}\n                value={option}"
new2 = "<ComboboxOption\n                key={option.id}\n                value={option}\n                onMouseEnter={() => prefetch(option.id)}"
result = result.replace(old2, new2)
print("Match!" if result != content else "NO MATCH")
open("src/components/Search/SearchComboBox.tsx", "w", encoding="utf-8").write(result)
