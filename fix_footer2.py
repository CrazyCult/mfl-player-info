content = open("src/components/Footer/index.tsx", "r", encoding="utf-8").read()
old = "Motherforked by{' '}\n        <a href='https://github.com/CrazyCult' target='_blank' className='text-muted-foreground/80 hover:text-muted-foreground/70'>CrazyCult</a>"
new = "Forked by{' '}\n        <a href='https://discord.com/users/219439055107129354' target='_blank' className='text-muted-foreground/80 hover:text-muted-foreground/70'>CrazyCult</a>"
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/components/Footer/index.tsx", "w", encoding="utf-8").write(result)
