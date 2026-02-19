content = open("src/components/Footer/index.tsx", "r", encoding="utf-8").read()
old = "Built by{' '}"
new = "Motherforked by{' '}\n        <a href='https://github.com/CrazyCult' target='_blank' className='text-muted-foreground/80 hover:text-muted-foreground/70'>CrazyCult</a>\n        {' '}&middot;{' '}Built by{' '}"
old2 = "@AliColeman170\n        </Link>\n        ."
new2 = "@AliColeman170\n        </Link>"
result = content.replace(old, new).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/components/Footer/index.tsx", "w", encoding="utf-8").write(result)
