"use client";

import styles from "../Navbar.module.css";

import { useState } from "react";
import MobileNavbar from "./MobileNavbar";


export default function MobileNavbarButton() {

  const [open, setOpen] = useState(false);


  return (
    <>
      <button
        className={`${styles.button} ${styles.mobileOnly}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>
      </button>

      <MobileNavbar open={open} setOpen={setOpen} />
    </>
  )
}
