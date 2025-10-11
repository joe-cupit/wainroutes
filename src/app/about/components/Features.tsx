import styles from "../About.module.css";
import fontStyles from "@/styles/fonts.module.css";

import {
  MapIcon,
  MoreIcon,
  PhotoIcon,
  RouteIcon,
  WeatherIcon,
} from "@/icons/MaterialIcons";

export default function Features() {
  return (
    <section>
      <div>
        <div className={styles.features}>
          <h2 className={fontStyles.heading}>What&apos;s on Wainroutes</h2>
          {/* <p>Everything on the site is designed to be useful for fellow walkers.</p> */}
          <div className={styles.featureGridContainer}>
            <ul className={styles.featureGrid}>
              <li>
                <RouteIcon />
                <h3 className={fontStyles.subheading}>Wainwright routes</h3>
                <p>
                  Guides for each walk I used to climb the Wainwrights,
                  including notable waypoints.
                </p>
              </li>
              <li>
                <MapIcon />
                <h3 className={fontStyles.subheading}>Maps and GPX</h3>
                <p>
                  Freely available GPX files and maps to help you follow the
                  routes yourself.
                </p>
              </li>
              <li>
                <WeatherIcon />
                <h3 className={fontStyles.subheading}>Mountain weather</h3>
                <p>
                  Up-to-date 5-day mountain weather forecasts from the Met
                  Office to help plan your walks.
                </p>
              </li>
              <li>
                <PhotoIcon />
                <h3 className={fontStyles.subheading}>Walk photos</h3>
                <p>
                  A selection of my favourite photos I&apos;ve taken on each
                  route.
                </p>
              </li>
              <li>
                <MoreIcon />
                <h3 className={fontStyles.subheading}>More to come</h3>
                <p>
                  I&apos;m constantly adding new walks and site features, so
                  Wainroutes will continue to grow.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
