import styles from "./Footer.module.css";
import fonts from "@/app/fonts.module.css";

import SiteSearchBar from "@/app/components/SiteSearchBar/SiteSearchBar";
import Link from "next/link";


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={styles.mainLeft}>
            <h2 className={fonts.heading}>wainroutes</h2>
            <SiteSearchBar
              reversed={true}
              small={true}
              className={styles.searchBar}
              placeholder="Find a walk"
            />
          </div>
          <div className={styles.mainRight}>
            <div className={styles.mainLinks}>
              <h3 className={fonts.subheading}>Explore</h3>
              <Link href="/walks">Walks</Link>
              <Link href="/walks">Map</Link>
              <Link href="/wainwrights">Wainwrights</Link>
              <Link href="/weather">Weather</Link>
            </div>
            <div className={styles.mainLinks}>
              <h3 className={fonts.subheading}>Discover</h3>
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </div>

        <div className={styles.base}>
          <p>&#169; 2025 Wainroutes</p>
          <p>A site by Joe Cupit.</p>
          {/* <p>A site by <a href="https://www.google.com" target="_blank">Joe Cupit</a>.</p> */}
        </div>
      </div>
    </footer>
  )
}