import styles from "../Walk.module.css";
import fontStyles from "@/app/fonts.module.css";

import Walk from "@/types/Walk";
import { TerrainExposureIcon, TerrainGradientIcon, TerrainPathIcon } from "@/icons/WalkIcons";


export default function Terrain({ selected, walkTerrain } : { selected: boolean; walkTerrain: Walk["terrain"] }) {

  return (
    <div className={`${styles.terrain} ${styles.asideSection} + ${selected ? styles.selected : ""}`}>
      <h2 className={fontStyles.subheading}>Terrain</h2>
      {walkTerrain
      ? <div className={styles.terrainMain}>
          <ul className={styles.terrainBadges}>
            <li>{walkTerrain?.gradient && <TerrainGradientIcon level={walkTerrain?.gradient} />}</li>
            <li>{walkTerrain?.path && <TerrainPathIcon level={walkTerrain?.path} />}</li>
            <li>{walkTerrain?.exposure && <TerrainExposureIcon level={walkTerrain?.exposure} />}</li>
          </ul>
          {(walkTerrain?.desc?.length ?? 0) > 0 ? <p>{walkTerrain?.desc}</p> : <></>}

          {/* <p className={fontStyles.subtext}>*terrain badges are merely a suggestion, always properly prepare for changing weather conditions</p> */}
        </div>
      : <p>No information available</p>}
    </div>
  )
}