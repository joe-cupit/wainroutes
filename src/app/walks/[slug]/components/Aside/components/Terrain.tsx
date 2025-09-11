import styles from "../../../Walk.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Link from "next/link";

import Walk from "@/types/Walk";
import { TerrainExposureIcon, TerrainGradientIcon, TerrainPathIcon } from "@/icons/TerrainIcons";
import { exposureLevels, gradientLevels, pathLevels, terrainTitles } from "@/app/safety/terrain-icons/consts";


export default function Terrain({ selected, walkTerrain } : { selected: boolean; walkTerrain: Walk["terrain"] }) {

  return (
    <div className={`${styles.terrain} ${styles.asideSection} ${selected ? styles.selected : ""}`}>
      <div>
        <h2 className={fontStyles.subheading}>Terrain</h2>
        <p>The terrain walk and stuff</p>
      </div>
      {walkTerrain
      ? <div className={styles.terrainMain}>
          <ul className={styles.terrainBadges}>
            {walkTerrain?.gradient &&
              <li className={styles.terrainBadge}>
                <Link href="/safety/terrain-icons#gradient">
                  <TerrainGradientIcon level={walkTerrain.gradient} />
                </Link>
                <div>
                  <h3>{terrainTitles[walkTerrain.gradient] + " steepness"}</h3>
                  <p>{gradientLevels[walkTerrain.gradient]}</p>
                </div>
              </li>
            }
            {walkTerrain?.path &&
              <li className={styles.terrainBadge}>
                <Link href="/safety/terrain-icons#path">
                  <TerrainPathIcon level={walkTerrain.path} />
                </Link>
                <div>
                  <h3>{terrainTitles[walkTerrain.path] + " path visibility"}</h3>
                  <p>{pathLevels[walkTerrain.path]}</p>
                </div>
              </li>
            }
            {walkTerrain?.exposure &&
              <li className={styles.terrainBadge}>
                <Link href="/safety/terrain-icons#exposure">
                  <TerrainExposureIcon level={walkTerrain.exposure} />
                </Link>
                <div>
                  <h3>{terrainTitles[walkTerrain.exposure] + " exposure"}</h3>
                  <p>{exposureLevels[walkTerrain.exposure]}</p>
                </div>
              </li>
            }
          </ul>
          {(walkTerrain?.desc?.length ?? 0) > 0 ? <p>{walkTerrain?.desc}</p> : <></>}

          {/* <p className={fontStyles.subtext}>*terrain badges are merely a suggestion, always properly prepare for changing weather conditions</p> */}
        </div>
      : <p>No information available</p>}
    </div>
  )
}