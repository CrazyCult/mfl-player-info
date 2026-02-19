content = open("src/components/Footer/index.tsx", "r", encoding="utf-8").read()
print(content[content.find("Motherforked")-20:content.find("Motherforked")+200])
