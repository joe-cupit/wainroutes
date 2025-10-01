import styles from "./Home.module.css";
import fontStyles from "@/styles/fonts.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import Script from "next/script";
import Link from "next/link";
import { createPageMetadata } from "@/utils/metadata";

import SiteSearchBar from "@/components/SiteSearchBar/SiteSearchBar";
import WalkCard from "@/components/WalkCard/WalkCard";
import WalkCardStyles from "@/components/WalkCard/WalkCard.module.css";
import LakeMap from "@/components/Map/Map";

import Walk from "@/types/Walk";
import { useHillMarkers } from "@/hooks/useMapMarkers";

import tempwalks from "@/data/walks.json";
import LazyPicture from "@/components/LazyImage/LazyPicture";
import { ArrowRightIcon } from "@/icons/MaterialIcons";


export function generateMetadata() {
  return createPageMetadata({
    title: "Wainroutes Lake District Walks",
    path: "/",
  });
}


export default function Home() {

  const featuredWalkSlugs = ["wetherlam-and-the-northern-coniston-fells", "castle-crag-with-millican-daltons-cave", "the-kentmere-horseshoe"];
  const walks = tempwalks as unknown as Walk[];
  const featuredWalks = featuredWalkSlugs.map(slug => walks.find(w => w.slug === slug));

  const hillMarkers = useHillMarkers();


  return (
    <>
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Wainroutes",
            "url": "https://wainroutes.co.uk/"
          }`
        }}
      />

      <main className={styles.home}>
        <section className={styles.heroSection}>
          <div className={styles.hero}>
            <h1 className={`${fontStyles.title} ${styles.title}`}>A Walker&apos;s Guide to the Wainwrights</h1>
            <SiteSearchBar className={styles.heroSearch} />
            <Link href="/walks" className={`${buttonStyles.button} ${buttonStyles.underlined}`}>View all walks</Link>
          </div>
          <div className={styles.heroImageOverlay} />
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
            <Link
              href="/walks"
              className={`${buttonStyles.button} ${buttonStyles.primary}`}
              draggable="false"
            >
              View all walks
            </Link>
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
              <Link
                href="/wainwrights"
                className={`${buttonStyles.button} ${buttonStyles.animate}`}
                draggable="false"
              >
                Go to list of Wainwrights <ArrowRightIcon />
              </Link>
            </div>
            <div className={styles.wainwrightsMap}>
              <LakeMap primaryMarkers={hillMarkers} />
            </div>
          </div>
        </section>

        <section>
          <div className={styles.about}>
            <div className={styles.aboutImage}>
              <LazyPicture
                newBase={true}
                names={["home/a-hiker-stood-at-the-cairn-on-high-street.webp", "home/a-hiker-stood-at-the-cairn-on-high-street-mobile.webp"]}
                widths={[800]}
                sizes="(min-width: 801px) 480px, 100vw"
                alt="A hiker stood at the cairn on High Street"
              />
            </div>
            <div className={styles.aboutText}>
              <h2 className={fontStyles.heading}>About Wainroutes</h2>
              <p>
                Wainroutes is a guide to walking the Lake District&apos;s Wainwrights, shaped by my own goal to climb all 214. Here I share the routes I&apos;ve followed, photos I&apos;ve taken, and resources I rely on when planning walks.
              </p>
              <p>
                Whether you&apos;re bagging Wainwrights or just looking for a day out in the fells, I hope Wainroutes makes it easier to enjoy the Lakes as much as I do.
              </p>
              <Link href="/about" className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.animate}`}>
                Read more about Wainroutes <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
