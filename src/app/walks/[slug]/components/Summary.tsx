import styles from "../Walk.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { Fragment } from "react";
import Link from "next/link";

import Hill from "@/types/Hill";
import Walk from "@/types/Walk";
import { displayDistance, displayElevation } from "@/utils/unitConversions";

import temphills from "@/data/hills.json";

export default function Summary({
  title,
  wainwrights,
  length,
  elevation,
  intro,
}: {
  title: Walk["title"];
  wainwrights: Walk["wainwrights"];
  length: Walk["length"];
  elevation: Walk["elevation"];
  intro: Walk["intro"];
}) {
  const hillsData = temphills as Hill[];
  const hillNames = Object.fromEntries(
    hillsData.map((hill) => [hill.slug, hill.name])
  );

  return (
    <div id="walk-summary" className={styles.summary}>
      <h1 className={fontStyles.heading}>{title}</h1>

      <h2
        className={`${fontStyles.subheading} visually-hidden`}
        id="walk_overview"
      >
        Summary
      </h2>
      <div className={styles.section}>
        <div className={`${styles.summaryGroup} ${styles.shouldWrap}`}>
          <h3 className={fontStyles.smallheading}>
            Wainwrights {"(" + wainwrights.length + ")"}:
          </h3>
          <p className={styles.wainwrights}>
            {wainwrights.map((hill, index) => {
              return (
                <Fragment key={index}>
                  <span>
                    <Link href={"/wainwrights/" + hill}>
                      {hillNames?.[hill]}
                    </Link>
                    {index + 1 < wainwrights.length ? "," : ""}
                  </span>
                  {index + 2 === wainwrights.length ? " and " : " "}
                </Fragment>
              );
            })}
          </p>
        </div>

        <div className={styles.summaryPair}>
          <div className={styles.summaryGroup}>
            <h3 className={fontStyles.smallheading}>Distance:</h3>
            <p>{displayDistance(length)}</p>
          </div>
          <div className={styles.summaryGroup}>
            <h3 className={fontStyles.smallheading}>Elevation:</h3>
            <p>{displayElevation(elevation)}</p>
          </div>
        </div>

        {intro && (
          <div>
            <h3
              className={fontStyles.smallheading}
              style={{ display: "block" }}
            >
              Overview:
            </h3>
            <p>{intro}</p>
          </div>
        )}
      </div>
    </div>
  );
}
