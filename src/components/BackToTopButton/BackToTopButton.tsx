"use client"

import styles from "./BackToTopButton.module.css";

import { useEffect, useState } from "react";

import { BackToTopIcon } from "@/icons/MaterialIcons";


export default function BackToTopButton({ minHeight = 400 }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    function toggleOverlay() {
      if ((document.scrollingElement?.scrollTop ?? 0) < minHeight) {
        setShowScrollTop(false);
      }
      else {
        setShowScrollTop(true);
      }
    }

    window.addEventListener("scroll", toggleOverlay);
    return () => {
      window.removeEventListener("scroll", toggleOverlay);
    }
  }, [minHeight])


  return (
    <button
      className={styles.button}
      onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
      data-show={showScrollTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <BackToTopIcon />
    </button>
  )
}
