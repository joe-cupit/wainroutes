import styles from "./Wainwrights.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { createPageMetadata } from "@/utils/metadata";

import Hill from "@/types/Hill";
import { useHillMarkers } from "@/hooks/useMapMarkers";

import wainsJson from "@/data/hills.json";
import getMapBounds from "@/utils/getMapBounds";
import WainwrightsClient from "./components/WainwrightsClient";


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
    <main className={styles.page}>

      <section>
        <div className={styles.main}>
          <div className={styles.header}>
            <h1 className={fontStyles.title}>The 214 Wainwrights</h1>
            <p>The Wainwrights are a collection of 214 fells in the Lake District, named after Alfred Wainwright's handwritten <i>Pictorial Guide to the Lakeland Fells</i>, written during the 1950s and 60s. Today, they are both a guide and a goal for walkers exploring the Lakes.</p>
          </div>
          <WainwrightsClient
            simplifiedHillData={simplifiedHillData}
            hillMarkers={hillMarkers}
            mapBounds={mapBounds}
          />
        </div>
      </section>

    </main>
  )
}