import styles from "./Wainwright.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/utils/metadata";

import Walk from "@/types/Walk";
import Hill, { BookTitles, Classifications } from "@/types/Hill";
import { displayElevation } from "@/utils/unitConversions";
import WalkCard from "@/components/WalkCard/WalkCard";

import wainsJson from "@/data/hills.json";
import walksJson from "@/data/walks.json";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";


type WainProps = {
  params: Promise<{ slug: string }>
}


export async function generateMetadata({ params } : WainProps) {
  const { slug }  = await params;
  const hillData = (wainsJson as unknown as Hill[]).find(w => w.slug === slug);
  if (!hillData) return {};

  const title = `${hillData.name} (${hillData.height}m) – Wainwright Routes & Details`;
  const description = `Details for ${hillData.name} (${hillData.height}m), a Wainwright in the Lake District, with walking routes, details, and nearby fells.`
  const path = `/wainwrights/${hillData.slug}`;

  return createPageMetadata({
    title, description, path
  });
}


export function generateStaticParams() {
  const wains = wainsJson as unknown as Hill[];
  
  return wains.map(wain => ({slug: wain.slug}));
}


export default async function Wainwright({ params } : WainProps) {

  const { slug }  = await params;

  const hillData = (wainsJson as unknown as Hill[]).find(w => w.slug === slug);
  if (!hillData) {
    return notFound();
  }

  const walkData = (walksJson as unknown as Walk[]).filter(walk => walk.wainwrights?.includes(slug));
  const bookNum = hillData?.book;

  return (
    <main className={styles.page}>

      <section>

        <div className={styles.main}>
          {/* <HillBook bookNum={bookNum} /> */}

          <div>
            <Breadcrumbs
              crumbs={{
                "Wainwrights": "/wainwrights",
                [BookTitles[hillData?.book ?? 1]]: "/wainwrights?book="+bookNum,
              }}
            />
            <h1 className={`${fontStyles.title} ${styles.title}`}>{hillData?.name} <span className={styles.titleElevation}>{displayElevation(hillData?.height)}</span></h1>
          </div>

          <p>
            More information coming soon.
          </p>

          <div className={styles.group}>
            <h2 className={fontStyles.subheading}>Stats</h2>
            <div className={styles.stats}>
              <h3>Book</h3>
              <p><Link href={"/wainwrights?book="+bookNum}>{BookTitles[hillData?.book ?? 1]}</Link></p>
              <h3>Height</h3>
              <p>{displayElevation(hillData?.height)}</p>
              <h3>Prominence</h3>
              <p>{displayElevation(hillData?.prominence)}</p>
              <h3>Grid Ref.</h3>
              <p>{hillData?.gridRef}</p>
              <h3>Other Classifications</h3>
              {(hillData?.classifications.length ?? 0) > 0
              ? <ul className={styles.classifications}>
                  {Object.keys(Classifications).map((code, index) => {
                    if (hillData?.classifications.includes(code)) return <li key={index}>{Classifications[code]}</li>
                  })}
                </ul>
              : <p>N/A</p>
              }
            </div>
          </div>

          <div className={styles.group}>
            <h2 className={fontStyles.subheading}>Walk This Fell</h2>
            {walkData && walkData.length > 0
              ? <div className={styles.walks}>
                  {walkData.map((walk, index) => {
                    return <WalkCard key={index} walk={walk} />
                  })}
                </div>
              : <p>There are no walks including this fell yet.</p>
            }
          </div>

          {hillData?.nearbyHills && hillData.nearbyHills.length > 0 &&
            <div className={styles.group}>
              <h2 className={fontStyles.subheading}>Some Nearby Wainwrights</h2>
              <p className={styles.nearbyList}>
                {hillData.nearbyHills.map((fell, index) => {
                  return (
                    <Fragment key={index}>
                      <Link href={"/wainwrights/"+fell.slug}>{fell.name}</Link>
                      {hillData.nearbyHills && index+1 < hillData.nearbyHills.length && ", "}
                    </Fragment>
                  )
                })}
              </p>
            </div>
          }

        </div>
      </section>

    </main>
  )
}
