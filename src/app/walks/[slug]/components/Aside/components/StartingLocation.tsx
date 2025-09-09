import styles from "../../../Walk.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Walk from "@/types/Walk";


export default function StartingLocation({ selected, startLocation, busRoutes } : { selected: boolean; startLocation: Walk["startLocation"]; busRoutes: Walk["busConnections"] }) {

  return (
    <div className={`${styles.asideSection} ${selected ? styles.selected : ""}`}>
      <h2 className={fontStyles.subheading}>Starting Location</h2>
      <div className={styles.locations}>

        <div className={styles.locationsRow}>
          <h3>Location</h3>
          <span className={styles.bold}>{startLocation?.location ?? "N/A"}</span>
        </div>

        <div className={styles.locationsRow}>
          <h3>Postcode</h3>
          <span className={styles.bold}>
            {startLocation?.postcode
            ? <a href={"https://www.google.com/maps/dir/?api=1&destination="+startLocation?.latitude+","+startLocation?.longitude}
                 target="_blank"
                 aria-label={startLocation?.postcode + " on Google Maps"}
              >
                {startLocation?.postcode}
              </a>
            : "N/A"
            }
          </span>
        </div>

        <div className={styles.locationsRow}>
          <h3>Grid Ref</h3>
          <span className={styles.bold}>{startLocation?.gridRef ?? "N/A"}</span>
        </div>

        {/* <div className={styles.locationsRow}>
          <h3>What3Words</h3>
          <span className={styles.bold}>
            {startLocation?.whatThreeWords
            ? <a href={"https://what3words.com/"+startLocation?.whatThreeWords} target="_blank">{"///"+startLocation?.whatThreeWords}</a>
            : "Unavailable"
            }
          </span>
        </div> */}

        <div className={styles.locationsRow}>
          <h3>Buses</h3>
          <ul className={styles.busses}>
            {(busRoutes && Object.keys(busRoutes).length > 0)
            ? Object.keys(busRoutes).sort((a, b) => parseInt(a) - parseInt(b)).map((bus, index) => {
                return (
                  <li key={index}
                    className={styles.busNumber}
                    style={{"backgroundColor": `var(--clr-bus-${bus})`}}
                  >
                    {bus}
                  </li>
                )
              })
            : "None"
            }
          </ul>
        </div>

      </div>
    </div>
  )
}