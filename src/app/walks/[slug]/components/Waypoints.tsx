import styles from "../Walk.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Walk from "@/types/Walk";

export default function Waypoints({
  waypoints,
}: {
  waypoints: Walk["waypoints"];
}) {
  return (
    <div id="walk-waypoints">
      <h2 className={fontStyles.subheading}>Waypoints</h2>
      <div className={styles.waypoints}>
        {waypoints
          ? Object.keys(waypoints).map((waypoint, index) => {
              return (
                <div key={index} className={styles.waypoint}>
                  <h3 className={fontStyles.smallheading}>{waypoint}</h3>
                  <p>{waypoints?.[waypoint].text}</p>
                  {waypoints?.[waypoint].warning && (
                    <p>
                      <strong>{waypoints?.[waypoint].warning}</strong>
                    </p>
                  )}
                </div>
              );
            })
          : "N/A"}
      </div>
    </div>
  );
}
