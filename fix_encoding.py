content = '''"use client";
import { useState, useCallback } from "react";
import html2canvas from "html2canvas";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Button } from "../UI/Button";

export function ShareCardButton({ targetId }: { targetId: string }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = useCallback(async () => {
    const element = document.getElementById(targetId);
    if (!element) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }, "image/png");
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [targetId]);

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      disabled={loading}
      title="Copier la fiche en PNG"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-500" />
      ) : (
        <ClipboardIcon className="h-4 w-4" />
      )}
      {copied ? "Copie !" : loading ? "..." : "Copier fiche"}
    </Button>
  );
}
'''
open("src/components/Player/ShareCardButton.tsx", "w", encoding="utf-8").write(content)
print("OK")
