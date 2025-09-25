import styles from "./Wainwrights.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { createPageMetadata } from "@/utils/metadata";

import Hill from "@/types/Hill";
import { useHillMarkers } from "@/hooks/useMapMarkers";
import BackToTopButton from "@/components/BackToTopButton/BackToTopButton";
import LakeMap from "@/components/Map/Map";

import WainwrightList from "./components/WainwrightList";

import wainsJson from "@/data/hills.json";
import getMapBounds from "@/utils/getMapBounds";


export function generateMetadata() {
  return createPageMetadata({
    title: "The 214 Wainwrights",
    description: "Discover all 214 Wainwrights in the Lake District with an interactive map and searchable list of fells.",
    path: "/wainwrights",
  });
}


export type SimplifiedHill = {
  slug: Hill["slug"];
  name: Hill["name"];
  secondaryName: Hill["secondaryName"];
  height: Hill["height"];
  book: Hill["book"];
}


export default function Wainwrights() {

  const simplifiedHillData = (wainsJson as Hill[]).map(hill => ({
    slug: hill.slug,
    name: hill.name,
    secondaryName: hill.secondaryName,
    height: hill.height,
    book: hill.book
  } as SimplifiedHill));

  const hillMarkers = useHillMarkers();

  const mapBounds = getMapBounds(
      [Math.min(...hillMarkers.map(p => p.coordinates[0])), Math.max(...hillMarkers.map(p => p.coordinates[0]))],
      [Math.min(...hillMarkers.map(p => p.coordinates[1])), Math.max(...hillMarkers.map(p => p.coordinates[1]))]
    )


  return (
    <main className={styles.wainwrights}>

      <section>
        <div className={styles.header}>
          <h1 className={fontStyles.title}>The 214 Wainwrights</h1>
          <p>214 fells within The Lake District, as described in A. Wainwright&apos;s <i>Pictorial Guides to the Lakeland Fells</i>.</p>
        </div>
      </section>

      <section>
        <div className={styles.main}>
          <BackToTopButton minHeight={400} />

          <WainwrightList simplifiedHills={simplifiedHillData} />

          <div className={styles.map}>
            <LakeMap
              mapMarkers={hillMarkers}
              activePoint={null}
              defaultCenter={mapBounds.center}
              defaultZoom={mapBounds.zoom}
            />
          </div>
        </div>
      </section>

      <div style={{height: "5rem"}}></div>

    </main>
  )
}