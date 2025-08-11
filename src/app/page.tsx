import styles from "./Home.module.css";
import fontStyles from "@/app/fonts.module.css";
import buttonStyles from "@/app/buttons.module.css";

import Link from "next/link";
import { createPageMetadata } from "@/utils/metadata";

import SiteSearchBar from "@/app/components/SiteSearchBar/SiteSearchBar";
import WalkCard from "@/app/components/WalkCard/WalkCard";
import WalkCardStyles from "@/app/components/WalkCard/WalkCard.module.css";
import LakeMap from "@/app/components/Map/Map";

import Walk from "@/types/Walk";
import { useHillMarkers } from "@/hooks/useMapMarkers";

import tempwalks from "@/data/walks.json";
import LazyPicture from "./components/LazyImage/LazyPicture";


export function generateMetadata() {
  return createPageMetadata({
    title: "Wainroutes Lake District Walks",
  });
}


export default function Home() {

  const featuredWalkSlugs = ["scafell-pike-and-lingmell-via-mickledore", "helvellyn-via-striding-edge", "rannerdale-knotts-from-buttermere"];
  const walks = tempwalks as unknown as Walk[];
  const featuredWalks = featuredWalkSlugs.map(slug => walks.find(w => w.slug === slug));


  const hillMarkers = useHillMarkers();


  return (
    <main className={styles.home}>
      <section className={styles.heroSection}>
        <div className={styles.hero}>
          <h1 className={`${fontStyles.title} ${styles.title}`}>Your Guide to Walking The Wainwrights</h1>
          <SiteSearchBar className={styles.heroSearch} />
          <Link href="/walks" className={`${buttonStyles.button} ${buttonStyles.underlined}`}>View all walks</Link>
        </div>

        <div className={styles.heroImageOverlay} />
        {/* <Image
          className={styles.heroImage}
          src="https://images.wainroutes.co.uk/wainroutes_home_01_2048w.webp"
          alt=""
          fill
          sizes="100vw"
          priority
        /> */}
        <div className={styles.heroImage}>
          <LazyPicture
            names={["home_01", "home_02"]}
            widths={[700]}
            sizes="200vw"
            eager={true}
          />
        </div>
      </section>

      <section>
        <div className={styles.featured}>
          <div className={styles.featuredTitle}>
            <h2 className={fontStyles.heading}>Featured Routes</h2>
          </div>

          <div className={WalkCardStyles.group}>
            {featuredWalks.map((walk, index) => {
                return walk && <WalkCard key={index} walk={walk} />
              })
            }
          </div>

          <Link href="/walks" className={`${buttonStyles.button} ${buttonStyles.primary}`}>View more walks</Link>
        </div>
      </section>

      <section className={styles.wainwrightsSection}>
        <div className={styles.wainwrights}>
          <div>
            <h2 className={fontStyles.heading}>The 214 Wainwrights</h2>

            <div className={styles.wainwrightsText}>
              <p>
                The Wainwrights are 214 fells in the Lake District collected by A. Wainwright in his seven-volume <i>Pictorial Guide to the Lakeland Fells</i>. Each book covers a different region, with hand-drawn maps, route details, and notes on the landscape.
              </p>
              <p>
                Since the first volume was published in 1955, Wainwright&apos;s writing has inspired many to get out and explore the Lakes, with plenty of walkers aiming to summit the full set.
              </p>
              <p>
                Here you&apos;ll find a collection of routes I&apos;ve used so far on my own journey to complete the Wainwrights. Whether you&apos;re aiming for all 214 or just looking for your next day out in the fells, I hope these walks help you enjoy the Lakes.
              </p>
            </div>
            <Link href="/wainwrights" className={buttonStyles.button}>Learn more about The Wainwrights</Link>
          </div>

          <div className={styles.wainwrightsMap}>
            <LakeMap mapMarkers={hillMarkers} />
          </div>
        </div>
      </section>

      <div style={{height: "5rem"}}></div>
    </main>
  );
}
