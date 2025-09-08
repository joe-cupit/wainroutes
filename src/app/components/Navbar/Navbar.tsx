import styles from "./Navbar.module.css";
import fonts from "@/app/fonts.module.css";

import Link from "next/link";

import MobileNavbarButton from "./components/MobileNavbarButton";
import NavbarClient from "./NavbarClient";
import WainroutesLogo from "../Logo/Logo";

const navbarId = "navbar";


export default async function Navbar() {


  return (
    <header
      id={navbarId}
      className={`${styles.navbar}`}
    >
      <NavbarClient targetId={navbarId} />

      <div className={styles.main}>

        <div className={styles.mainLeft}>
          <Link href="/" className={`${styles.logo} ${fonts.heading}`}>
            <WainroutesLogo />
            Wainroutes
          </Link>
        </div>

        <div className={styles.mainRight}>
          <nav id="navbar-nav" className={styles.nav}>
            <Link href="/walks">Find a walk</Link>
            <Link href="/about">About</Link>
            <Link href="/wainwrights">Wainwrights</Link>
            <Link href="/weather">Weather</Link>
          </nav>

          <MobileNavbarButton />
        </div>
      </div>
    </header>
  )
}