content = open("src/components/Player/ShareCardButton.tsx", "r", encoding="utf-8").read()
old = '    } catch (e) {\n      console.error(e);\n    }'
new = '    } catch (e) {\n      console.error(e);\n      alert("Erreur: " + e);\n    }'
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/ShareCardButton.tsx", "w", encoding="utf-8").write(result)
