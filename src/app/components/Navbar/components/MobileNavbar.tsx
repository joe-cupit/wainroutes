"use client"

import styles from "../Navbar.module.css";
import fonts from "@/app/fonts.module.css";

import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const id = "navbar-mobile";


export default function MobileNavbar({ open, setOpen } : { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) {

  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen])

  const clickListener = useCallback((e: Event) => {
    const mobileNav = document.getElementById(id);
    if (mobileNav && !e.composedPath().includes(mobileNav)) {
      setOpen(false);
    }
  }, [setOpen])


  // useEffect(() => {
  //   if (!open) return;

  //   document.addEventListener("mouseup", clickListener);
  //   return () => {
  //     document.removeEventListener("mouseup", clickListener);
  //   }
  // }, [open, clickListener])


  return (
    <div
      id={id}
      className={`${styles.mobile} ${open ? styles.active : ""}`}
      aria-expanded={open}
    >
      {/* <button className={styles.button} onClick={() => setOpen(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{scale: 1.2}}>
          <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button> */}

      <nav>
        <ul>
          <div>
            <li><Link href="/walks">Find a walk</Link></li>
          </div>

          <div>
            <h2>Site</h2>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </div>

          <div>
            <h2>Lake District</h2>
            <li><Link href="/weather">Weather</Link></li>
            <li><Link href="/wainwrights">Wainwrights</Link></li>
            <li><Link href="/travel">Travel</Link></li>
            <li><Link href="/safety">Safety</Link></li>
          </div>
        </ul>
      </nav>

      <p className={styles.bottomQuote}>"No pain, no Wain" -LT</p>
    </div>
  )
}