import styles from "../Walk.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Walk from "@/types/Walk";


export default function Waypoints({ waypoints } : { waypoints: Walk["waypoints"] }) {

  return (
    <div id="walk-waypoints">
      <h2 className={fontStyles.subheading} id="walk_waypoints">Waypoints</h2>
      <div className={styles.section}>
        {waypoints
        ? Object.keys(waypoints).map((waypoint, index) => {
            return (
              <div key={index}>
                <h3 className={fontStyles.smallheading}>{waypoint}</h3>
                <p>{waypoints?.[waypoint]}</p>
              </div>
            )
          })
        : "N/A"
        }
      </div>
    </div>
  )
}