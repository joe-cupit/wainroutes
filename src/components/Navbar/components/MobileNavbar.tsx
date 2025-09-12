"use client"

import styles from "../Navbar.module.css";

import { Dispatch, SetStateAction, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function MobileNavbar({ open, setOpen } : { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) {

  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen])


  return (
    <div
      className={`${styles.mobile} ${open ? styles.active : ""}`}
      aria-expanded={open}
    >
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

      <p className={styles.bottomQuote}>&quot;No pain, no Wain&quot; -LT</p>
    </div>
  )
}