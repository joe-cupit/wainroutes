import styles from "./Navbar.module.css";
import fonts from "@/app/fonts.module.css";

import Link from "next/link";


export default function Navbar() {

  return (
    <>
      <header
        className={styles.navbar}
      >

        <div className={styles.main}>

          <div className={styles.mainLeft}>
            <button className={`${styles.button} ${styles.mobileOnly}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
              </svg>
            </button>

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

      <div id="navbar-mobile" className={styles.mobile}>
        <button className={styles.button}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="5 5 18 18" strokeWidth="2" stroke="currentColor">
            <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <nav>
          <ul className={fonts.heading}>
            <li><Link href="/">home</Link></li>
            <li><Link href="/walks">walks</Link></li>
            <li><Link href="/wainwrights">wainwrights</Link></li>
            <li><Link href="/weather">weather</Link></li>
            <li><Link href="/travel">travel</Link></li>
          </ul>
        </nav>
      </div>
    </>
  )
}