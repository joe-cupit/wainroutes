import styles from "./Navbar.module.css";
import fonts from "@/app/fonts.module.css";

import Link from "next/link";

import MobileNavbarButton from "./components/MobileNavbarButton";
import NavbarClient from "./NavbarClient";

const navbarId = "navbar";


export default async function Navbar() {


  return (
    <>
      <header
        id={navbarId}
        className={`${styles.navbar}`}
      >
        <NavbarClient targetId={navbarId} />

        <div className={styles.main}>

          <div className={styles.mainLeft}>
            <MobileNavbarButton />

            <Link href="/" className={fonts.heading}>wainroutes</Link>
          </div>

          <div className={styles.mainRight}>
            <nav id="navbar-nav" className={styles.nav}>
              <Link href="/walks">walks</Link>
              <Link href="/wainwrights">wainwrights</Link>
              <Link href="/weather">weather</Link>
              <Link href="/travel">travel</Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}