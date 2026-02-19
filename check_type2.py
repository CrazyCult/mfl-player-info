content = open("src/types/global.types.ts", "r", encoding="utf-8").read()
# Compter les occurrences de goalkeeping
import re
matches = [(m.start(), content[m.start()-100:m.start()+50]) for m in re.finditer("goalkeeping", content)]
for pos, ctx in matches:
    print(f"--- pos {pos} ---")
    print(ctx)
    print()
