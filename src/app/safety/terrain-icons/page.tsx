import styles from "./Terrain.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Link from "next/link";

import { createPageMetadata } from "@/utils/metadata";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

import { exposureLevels, gradientLevels, pathLevels, terrainTitles } from "./consts";
import { TerrainExposureIcon, TerrainGradientIcon, TerrainPathIcon } from "@/icons/TerrainIcons";


export function generateMetadata() {
  return createPageMetadata({
    title: "Walk Terrain Icons",
    description: "Details on walk terrain icons.",
    path: "/safety/terrain-icons",
  });
}


export default function page() {

  const terrainLevels : (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

  return (
    <main>
      <section>
        <div className={styles.main}>
          <div style={{display: "grid", gap: "0.5rem"}}>
            <Breadcrumbs
              crumbs={{
                "Safety": "/safety",
                "Terrain Icons": "/safety/terrain-icons",
              }}
            />
            <h1 className={fontStyles.title}>Walk Terrain Icons</h1>
            <p>These icons help to give you some idea of the terrain of a walk. They are just a suggestion. Anyone going out into the mountains should be aware of the risks and prepare for all weather conditions. For more information on this check our <Link href="/safety">saftey page</Link></p>

            <p><b>Notice: Anyone going out into the mountains should be aware of the risks and prepare for all weather conditions.</b></p>
          </div>

          <div className={styles.terrainGroup}>
            <h2 className={fontStyles.heading} id="gradient">Gradient</h2>
            <p>Describes the extent of the gradient necessary to complete the walk.</p>
            <ul className={styles.iconGroup}>
              {terrainLevels.map(index =>
                <li key={index}>
                  <TerrainGradientIcon level={index} />
                  <div>
                    <h3 className={fontStyles.subheading}>{terrainTitles[index] + " steepness"}</h3>
                    <p>{gradientLevels[index]}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className={fontStyles.heading} id="path">Path Visibility</h2>
            <p>Describes how visible the path is.</p>
            <ul className={styles.iconGroup}>
              {terrainLevels.map(index =>
                <li key={index}>
                  <TerrainPathIcon level={index} />
                  <div>
                    <h3 className={fontStyles.subheading}>{terrainTitles[index] + " path visibility"}</h3>
                    <p>{pathLevels[index]}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className={fontStyles.heading} id="exposure">Exposure</h2>
            <p>Describes the extent exposure.</p>
            <ul className={styles.iconGroup}>
              {terrainLevels.map(index =>
                <li key={index}>
                  <TerrainExposureIcon level={index} />
                  <div>
                    <h3 className={fontStyles.subheading}>{terrainTitles[index] + " exposure"}</h3>
                    <p>{exposureLevels[index]}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div>
            <b>Be prepared.</b>
          </div>
        </div>

      </section>

      <div style={{height: "5rem"}}></div>
    </main>
  )
}
