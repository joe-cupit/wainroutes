"use client";

import buttonStyles from "@/styles/buttons.module.css";
import { useCallback } from "react";
import { DownloadIcon } from "@/icons/MaterialIcons";

export default function DownloadButton({ slug }: { slug: string }) {
  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = `/download/gpx/${slug}`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [slug]);

  return (
    <button
      className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.small}`}
      title="Download GPX file"
      onClick={handleDownload}
    >
      <DownloadIcon /> Download GPX
    </button>
  );
}
