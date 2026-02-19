content = open("src/types/global.types.ts", "r", encoding="utf-8").read()
print(repr(content[content.find("retirementYears")-50:content.find("retirementYears")+30]) if "retirementYears" in content else "NOT FOUND")
