"use client"

import styles from "../Navbar.module.css";

import { Dispatch, SetStateAction, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon } from "@/icons/MaterialIcons";


export default function MobileNavbar({ open, setOpen } : { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) {

  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen])

  function renderLink(href: string, name: React.ReactNode) {
    return (
      <li>
        <Link
          href={href}
          onClick={() => setOpen(false)}
        >
          {name}
        </Link>
      </li>
    )
  }


  return (
    <div
      className={`${styles.mobile} ${open ? styles.active : ""}`}
      aria-expanded={open}
    >
      <nav>
        <ul>
          <div>
            {renderLink("/walks", <>Find a walk <SearchIcon /></>)}
          </div>

          <div>
            <h2>Site</h2>
            {renderLink("/", "Home")}
            {renderLink("/about", "About")}
            {renderLink("/contact", "Contact")}
          </div>

          <div>
            <h2>Lake District</h2>
            {renderLink("/weather", "Weather")}
            {renderLink("/wainwrights", "Wainwrights")}
            {renderLink("/safety", "Safety")}
            {renderLink("/travel", "Travel")}
          </div>
        </ul>
      </nav>

      <p className={styles.bottomQuote}>&quot;No pain, no Wain&quot; -LT</p>
    </div>
  )
}