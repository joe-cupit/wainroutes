import styles from "./Footer.module.css";
import fonts from "@/styles/fonts.module.css";

import WainroutesLogo from "@/components/Logo/Logo";
import SiteSearchBar from "@/components/SiteSearchBar/SiteSearchBar";
import LinkList from "./components/LinkList";
import Mountains from "./components/Mountains";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Mountains />

      <div className={styles.grid}>
        <div className={styles.row}>
          <div className={styles.logo}>
            <WainroutesLogo />
            <h2 className={fonts.heading}>wainroutes</h2>
          </div>
        </div>

        <div className={`${styles.row} ${styles.wrappable}`}>
          <div className={styles.search}>
            <h2 className={fonts.smallheading}>Search for a walk</h2>
            <SiteSearchBar
              reversed={true}
              small={true}
              className={styles.searchBar}
              placeholder="Search for a route, fell, or town"
            />
          </div>

          <div className={styles.group}>
            <LinkList
              heading="Plan a trip"
              links={{
                "Find a walk": "/walks",
                "Weather": "/weather",
                "Wainwrights": "/wainwrights",
                "Safety": "/safety",
                "Travel": "/travel",
              }}
            />
            <LinkList
              heading="Wainroutes"
              links={{
                Home: "/",
                About: "/about",
                Contact: "/contact",
                Donate: "/about/support",
              }}
            />
          </div>
        </div>

        <div className={`${styles.row} ${styles.base}`}>
          <p>&#169; 2025 Wainroutes</p>
          <p>A site by Joe Cupit.</p>
        </div>
      </div>
    </footer>
  );
}
