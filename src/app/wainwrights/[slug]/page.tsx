import styles from "./Wainwright.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/utils/metadata";

import Walk from "@/types/Walk";
import Hill, { BookTitles, Classifications } from "@/types/Hill";

import wainsJson from "@/data/hills.json";
import walksJson from "@/data/walks.json";
import { useHillMarkers } from "@/hooks/useMapMarkers";

import haversineDistance from "@/utils/haversineDistance";
import { displayDistance, displayElevation } from "@/utils/unitConversions";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import WalkCard from "@/components/WalkCard/WalkCard";
import LakeMap from "@/components/Map/Map";


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

  const hillMarkers = useHillMarkers().filter(hill => hill.properties.slug === hillData.slug);
  const secondaryMarkers = useHillMarkers().filter(hill => hill.properties.slug !== hillData.slug);


  const walkData = (walksJson as unknown as Walk[])
                      .filter(walk => walk.wainwrights?.includes(slug))
                      .sort((a, b) => b.wainwrights.length - a.wainwrights.length);
  const bookNum = hillData?.book;

  const nearbyHills = (wainsJson as unknown as Hill[])
                        .map(hill => ({hill: hill, distance: haversineDistance([hill.longitude, hill.latitude], [hillData.longitude, hillData.latitude])}))
                        .sort((a, b) => a.distance - b.distance)
                        .slice(1, 10)

  return (
    <main className={styles.page}>

      <section>

        <div className={styles.main}>
          <div>
            <Breadcrumbs
              crumbs={{
                "Wainwrights": "/wainwrights",
                [BookTitles[hillData?.book ?? 1]]: "/wainwrights?book="+bookNum,
              }}
            />
            <h1 className={`${fontStyles.title} ${styles.title}`}>{hillData?.name} <span className={styles.titleElevation}>{displayElevation(hillData?.height)}</span></h1>
          </div>


          <div className={styles.group}>
            <div className={styles.details}>
              <h2 className="visually-hidden">Details</h2>
              <p>
                More information coming soon.
              </p>
              <div className={styles.stats}>
                <div>
                  <h3 className={fontStyles.smallheading}>Area</h3>
                  <Link href={"/wainwrights?book="+bookNum}>{`${hillData.book}- ${BookTitles[hillData.book ?? 1]}`}</Link>
                </div>
                <div>
                  <h3 className={fontStyles.smallheading}>Grid Ref.</h3>
                  <p>{hillData?.gridRef}</p>
                </div>
                <div>
                  <h3 className={fontStyles.smallheading}>Height</h3>
                  <p>{displayElevation(hillData?.height)}</p>
                </div>
                <div>
                  <h3 className={fontStyles.smallheading}>Prominence</h3>
                  <p>{displayElevation(hillData?.prominence)}</p>
                </div>
                <div>
                  <h3 className={fontStyles.smallheading}>Other Classifications</h3>
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
            </div>

            <div className={styles.map}>
              <LakeMap
                primaryMarkers={hillMarkers}
                secondaryMarkers={secondaryMarkers}
                activePoint={hillData.slug}

                defaultCenter={[hillMarkers[0].coordinates[0] + 0.0075, hillMarkers[0].coordinates[1]]}
                defaultZoom={12}
                defaultMinZoom={9}

                disableAutomaticMapBounds={true}
              />
            </div>
          </div>

          <div>
            <h2 className={fontStyles.subheading}>Routes up {hillData.name}</h2>
            {(walkData && walkData.length > 0)
              ? <>
                  <p>
                    {(walkData.length === 1)
                      ? "There is currently one walk that includes this fell."
                      : `There are currently ${walkData.length} walks that include this fell.`
                    }
                  </p>
                  <div className={styles.walks}>
                    {walkData.map((walk, index) => {
                      return <WalkCard key={index} walk={walk} />
                    })}
                  </div>
                </>
              : <p>There are currently no walks including this fell.</p>
            }
          </div>

          <div>
            <h2 className={fontStyles.subheading}>Nearby Wainwrights</h2>
            <p>The closest ten fells to {hillData.name}.</p>
            <ul className={styles.nearbyList}>
              {nearbyHills.map((fell, index) => {
                return (
                  <li key={index}>
                    <Link href={"/wainwrights/"+fell.hill.slug}>{fell.hill.name}</Link> ({displayDistance(fell.distance / 1000, 1)} away)
                  </li>
                )
              })}
            </ul>
          </div>

        </div>
      </section>

    </main>
  )
}
