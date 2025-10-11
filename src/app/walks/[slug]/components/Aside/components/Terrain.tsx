import styles from "../Aside.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Link from "next/link";

import Walk from "@/types/Walk";
import {
  TerrainExposureIcon,
  TerrainGradientIcon,
  TerrainPathIcon,
} from "@/icons/TerrainIcons";
import {
  exposureLevels,
  exposureTitles,
  gradientLevels,
  gradientTitles,
  pathLevels,
  pathTitles,
} from "@/app/safety/terrain-icons/consts";
import { InfoIcon } from "@/icons/MaterialIcons";

export default function Terrain({
  selected,
  walkTerrain,
}: {
  selected: boolean;
  walkTerrain: Walk["terrain"];
}) {
  return (
    <div
      className={`${styles.terrain} ${styles.asideSection} ${
        selected ? styles.selected : ""
      }`}
    >
      <div className={styles.terrainTitle}>
        <h2 className={fontStyles.subheading}>Walk Terrain</h2>
        <Link
          href="/safety/terrain-icons"
          title="Find out more about terrain icons"
        >
          <InfoIcon />
        </Link>
      </div>
      {walkTerrain ? (
        <div className={styles.terrainMain}>
          <ul className={styles.terrainBadges}>
            {walkTerrain?.gradient && (
              <li className={styles.terrainBadge}>
                <Link href="/safety/terrain-icons#gradient">
                  <TerrainGradientIcon level={walkTerrain.gradient} />
                </Link>
                <div>
                  <h3 className={fontStyles.smallheading}>
                    {gradientTitles[walkTerrain.gradient]}
                  </h3>
                  <p>{gradientLevels[walkTerrain.gradient]}</p>
                </div>
              </li>
            )}
            {walkTerrain?.path && (
              <li className={styles.terrainBadge}>
                <Link href="/safety/terrain-icons#path">
                  <TerrainPathIcon level={walkTerrain.path} />
                </Link>
                <div>
                  <h3 className={fontStyles.smallheading}>
                    {pathTitles[walkTerrain.path]}
                  </h3>
                  <p>{pathLevels[walkTerrain.path]}</p>
                </div>
              </li>
            )}
            {walkTerrain?.exposure && (
              <li className={styles.terrainBadge}>
                <Link href="/safety/terrain-icons#exposure">
                  <TerrainExposureIcon level={walkTerrain.exposure} />
                </Link>
                <div>
                  <h3 className={fontStyles.smallheading}>
                    {exposureTitles[walkTerrain.exposure]}
                  </h3>
                  <p>{exposureLevels[walkTerrain.exposure]}</p>
                </div>
              </li>
            )}
          </ul>
          {/* {(walkTerrain?.desc?.length ?? 0) > 0 ? <p>{walkTerrain?.desc}</p> : <></>} */}

          <p className={`${styles.walkTerrainNote} ${fontStyles.subtext}`}>
            These ratings are based on my own experience and are for guidance
            only.
          </p>
        </div>
      ) : (
        <p>No information available</p>
      )}
    </div>
  );
}
