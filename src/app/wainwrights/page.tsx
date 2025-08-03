import styles from "./Wainwrights.module.css";
import fontStyles from "@/app/fonts.module.css";

import { useHillMarkers } from "@/hooks/useMapMarkers";
import BackToTopButton from "@/app/components/BackToTopButton/BackToTopButton";
import LakeMap from "@/app/components/Map/Map";

import WainwrightList from "./components/WainwrightList";


export default function Wainwrights() {

  const hillMarkers = useHillMarkers();


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

          <WainwrightList />

          <div className={styles.map}>
            <LakeMap
              mapMarkers={hillMarkers}
              activePoint={null}
            />
          </div>
        </div>
      </section>

      <div style={{height: "5rem"}}></div>

    </main>
  )
}