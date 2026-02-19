content = open("src/components/Search/SearchComboBox.tsx", "r", encoding="utf-8").read()
old = "const router = useRouter();\n  const prefetch = (id: number) => router.prefetch(`/player/${id}`);"
new = "const router = useRouter();"
old2 = "<ComboboxOption\n                key={option.id}\n                value={option}\n                onMouseEnter={() => prefetch(option.id)}"
new2 = "<ComboboxOption\n                key={option.id}\n                value={option}"
result = content.replace(old, new).replace(old2, new2)
print("Reverted!" if result != content else "NO MATCH")
open("src/components/Search/SearchComboBox.tsx", "w", encoding="utf-8").write(result)
