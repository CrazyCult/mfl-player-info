"use client";
import { useState, useCallback } from "react";
import { ClipboardIcon, CheckIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Button } from "../UI/Button";

export function ShareCardButton({ playerId }: { playerId: number }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/player-card?id=${playerId}`);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [playerId]);

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

    </Button>
  );
}
