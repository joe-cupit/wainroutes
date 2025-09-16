import styles from "./Terrain.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Link from "next/link";

import { createPageMetadata } from "@/utils/metadata";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

import { exposureLevels, exposureTitles, gradientLevels, gradientTitles, pathLevels, pathTitles } from "./consts";
import { TerrainExposureIcon, TerrainGradientIcon, TerrainPathIcon } from "@/icons/TerrainIcons";
import Image from "next/image";


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
    <main className={styles.page}>
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
            <p>In order to provide some additional information about what to expect from each walk, I&apos;ve created a set of icons that highlight key aspects of the terrain. They&apos;re designed as a quick reference, so you can get a sense of the challenges and ease of a route at a glance.</p>
            <p>The icons reflect my own experience on each walk, so they&apos;re not definitive, but I hope you find them a useful guide when exploring the site.</p>
          </div>

          <div className={styles.terrainGroup}>
            <h2 className={fontStyles.heading} id="gradient">Route Gradients</h2>
            <p>Gradient describes how steep the terrain is underfoot and how much effort is required to gain height. In the Lake District, almost every walk involves some uphill, but the steepness and length of the climbs can vary a lot.</p>
            <ul className={styles.iconGroup}>
              {terrainLevels.map(index =>
                <li key={index}>
                  <TerrainGradientIcon level={index} />
                  <div>
                    <h3 className={fontStyles.subheading}>{gradientTitles[index]}</h3>
                    <p>{gradientLevels[index]}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div className={styles.terrainGroup}>
            <h2 className={fontStyles.heading} id="path">Path Visibility</h2>
            <p>Path visibility refers to how obvious the route is on the ground. While many fells have clear, well-worn trails, others can fade away into rough ground where good navigation skills are essential. Weather can also make a big difference to how visible a path is and in worse weather navigation is always trickier.</p>
            <ul className={styles.iconGroup}>
              {terrainLevels.map(index =>
                <li key={index}>
                  <TerrainPathIcon level={index} />
                  <div>
                    <h3 className={fontStyles.subheading}>{pathTitles[index]}</h3>
                    <p>{pathLevels[index]}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div className={styles.terrainGroup}>
            <h2 className={fontStyles.heading} id="exposure">Exposure</h2>
            <p>Exposure refers to how close the route comes to steep drops and the seriousness of the consequences of a fall. Some people are more comfortable with exposure than others, but knowing what to expect helps you prepare mentally as well as physically.</p>
            <ul className={styles.iconGroup}>
              {terrainLevels.map(index =>
                <li key={index}>
                  <TerrainExposureIcon level={index} />
                  <div>
                    <h3 className={fontStyles.subheading}>{exposureTitles[index]}</h3>
                    <p>{exposureLevels[index]}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className={styles.noteContainer}>
          <div className={styles.note}>
            <div>
              <b>Be prepared.</b>
              <h2 className={fontStyles.heading}>A Note on These Ratings</h2>
            </div>
            <p>These ratings are based on my own experience and are intended only as a guide. Terrain and conditions in the Lake District can change quickly, and everyone&apos;s confidence levels and abilities are different.</p>
            <p>If you&apos;re planning a walk, you must judge for yourself whether you and everyone you are going with are prepared and are confident in their abilities. Always bring the right gear, plenty of food and water, check the weather conditions, and be aware of the risks involved in mountain walking.</p>
            <p>More information on how to best prepare can be found on the <Link href="/safety">safety page</Link> and many freely available resources on the internet.</p>
          </div>

        <div className={styles.noteImage}>
          <Image
            src="/images/terrain-icons.JPEG"
            fill={true}
            sizes="(min-width: 832px): 480px, 100vw"
            alt="A well prepared walker on top of a snow-covered mountain"
          />
        </div>
        </div>
      </section>

    </main>
  )
}
