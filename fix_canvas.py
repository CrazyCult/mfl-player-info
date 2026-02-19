content = open("src/components/Player/ShareCardButton.tsx", "r", encoding="utf-8").read()
old = '''      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });'''
new = '''      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        onclone: (doc) => {
          const el = doc.getElementById(targetId);
          if (el) el.style.colorScheme = "light";
        },
      });'''
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/ShareCardButton.tsx", "w", encoding="utf-8").write(result)
