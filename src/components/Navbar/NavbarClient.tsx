"use client";

import styles from "./Navbar.module.css";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function NavbarClient({ targetId }: { targetId: string }) {
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const navbar = document.getElementById(targetId);
    if (!navbar) return;

    const checkScroll = () => {
      // make navbar invisible at the top of homepage
      if (pathname === "/" && window.scrollY < 50) {
        navbar.classList.add(styles.invisible);
      } else {
        navbar.classList.remove(styles.invisible);
      }

      // check for scroll up on mobile
      if (window.innerWidth < 832) {
        if (window.scrollY > 0 && window.scrollY < lastScrollY.current) {
          navbar.classList.add("sticky");
        } else {
          navbar.classList.remove("sticky");
        }

        lastScrollY.current = Math.max(window.scrollY, 0);
      }
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, [pathname, targetId]);

  return null;
}
