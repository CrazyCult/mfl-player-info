content = open("src/components/Search/SearchComboBox.tsx", "r", encoding="utf-8").read()
old = "    onChange={(e) => {\n              setQuery(e.target.value);\n              setSelectedPlayer(null);\n            }}"
new = "    onChange={(e) => {\n              const val = e.target.value;\n              setQuery(val);\n              setSelectedPlayer(null);\n            }}"
result = content.replace(old, new)
print(\"done\" if result != content else \"no match\")
open("src/components/Search/SearchComboBox.tsx", "w", encoding="utf-8").write(result)
