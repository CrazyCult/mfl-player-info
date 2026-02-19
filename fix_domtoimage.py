content = """\"use client\";
import { useState, useCallback } from \"react\";
import domtoimage from \"dom-to-image-more\";
import { ClipboardIcon, CheckIcon } from \"@heroicons/react/24/outline\";
import { Button } from \"../UI/Button\";

export function ShareCardButton({ targetId }: { targetId: string }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = useCallback(async () => {
    const element = document.getElementById(targetId);
    if (!element) return;
    setLoading(true);
    try {
      const blob = await domtoimage.toBlob(element, { scale: 2 });
      await navigator.clipboard.write([
        new ClipboardItem({ \"image/png\": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
      alert(\"Erreur: \" + e);
    }
    setLoading(false);
  }, [targetId]);

  return (
    <Button
      onClick={handleCopy}
      variant=\"outline\"
      size=\"sm\"
      disabled={loading}
      title=\"Copier la fiche en PNG\"
    >
      {copied ? (
        <CheckIcon className=\"h-4 w-4 text-green-500\" />
      ) : (
        <ClipboardIcon className=\"h-4 w-4\" />
      )}
      {copied ? \"Copie !\" : loading ? \"...\" : \"Copier fiche\"}
    </Button>
  );
}
"""
open("src/components/Player/ShareCardButton.tsx", "w", encoding="utf-8").write(content)
print("OK")
