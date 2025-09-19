import styles from "./Safety.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { createPageMetadata } from "@/utils/metadata";

import LazyImage from "@/components/LazyImage/LazyImage";
import BigImageHero from "@/components/BigImageHero/BigImageHero";
import PageLinkGrid from "@/components/PageLinkGrid/PageLinkGrid";


export function generateMetadata() {
  return createPageMetadata({
    title: "Safety in the Lake District",
    description: "Tips for staying safe on the fells of the Lake District, including preparation, clothing, equipment, and navigation tips for your walks.",
    path: "/safety",
    imageURL: `https://images.wainroutes.co.uk/safety/walker-scrambling-the-final-section-of-striding-edge-thumb_1024w.webp`,
  });
}


export default async function Safety() {

  return (
    <main className={styles.page}>
      <BigImageHero
        title="Safety in the Lake District"
        src="safety/walker-scrambling-the-final-section-of-striding-edge.webp"
        srcSmall="safety/walker-scrambling-the-final-section-of-striding-edge-mobile.webp"
        alt="A climber scrambling the final section of Striding Edge"
      />

      {/* <section className={styles.weatherBg}>
        <div className={styles.weather}>
          <h2 className="visually-hidden">Current Weather Conditions</h2>

          <div className={styles.weatherHazards}>
            <h3 className={fontStyles.subheading}>Today&apos;s Mountain Hazards:</h3>

            {weather.hazards
              ? <ul className={weatherStyles.mountainHazardsList}>
                  {weather.hazards.high && Object.keys(weather.hazards.high).map((hazard, index) => {
                    return <li key={index} className={weatherStyles.mountainHazardHigh}>{hazard}</li>
                  })}
                  {weather.hazards.medium && Object.keys(weather.hazards.medium).map((hazard, index) => {
                    return <li key={index} className={weatherStyles.mountainHazardMedium}>{hazard}</li>
                  })}
                  {weather.hazards.low && Object.keys(weather.hazards.low).map((hazard, index) => {
                    return <li key={index} className={weatherStyles.mountainHazardLow}>{hazard}</li>
                  })}
                </ul>
              : "None reported"
            }
          </div>

          <Link
            href="/weather"
            className={`${buttonStyles.button} ${buttonStyles.secondary}  ${buttonStyles.animate}`}
          >
            View full 5-day mountain forecast <ArrowRightIcon />
          </Link>
        </div>
      </section> */}

      <section>
        <div className={styles.intro}>
          <h2 className={fontStyles.heading}>Getting Mountain Ready</h2>
          <p>
            {/* Walking in the Lake District is generally safe, but hiking in the mountains has its risks and those getting involved should be aware and prepared for them. */}
            Summiting the fells is one of the best ways to enjoy the Lake District, but conditions in the mountains can be unpredictable and everyone&apos;s abilities vary.
            This page gives you what you need to know to stay prepared and plan your walks with confidence.
            {/* This page gives you the key tips and advice to stay prepared and plan your walks with confidence. */}
          </p>
        </div>
      </section>

      <section className={styles.groupSection}>
        <div className={styles.groupContainer}>
          {/* <h2 className={fontStyles.heading}>Things to Think About</h2> */}
          <div className={styles.group}>
            <div>
              <h3 className={fontStyles.subheading}>Weather Conditions</h3>
              <p>
                Always check the forecast both on the days before and morning of your walk, and prepare accordingly.
                Conditions on the fells are often very different from the valleys and can change quickly.
                In cold weather, extra layers are essential and crampons may be needed if the route is icy.
                In hot weather, bring plenty of water and use sun protection since there&apos;s very little shade on the mountains.
              </p>
              <b>
                In poor conditions, it&apos;s best to avoid exposed ridges and scambles.
              </b>
            </div>
            <div className={styles.image}>
              <LazyImage
                newBase={true}
                name="safety/sun-setting-on-lake-district-fells.webp"
                sizes="(min-width: 832px) 480px, 100vw"
                alt="On a mountain top looking towards a setting sun"
              />
            </div>
          </div>

          <div className={`${styles.group} ${styles.reversed}`}>
            <div className={styles.image}>
              <LazyImage
                newBase={true}
                name="safety/hiker-in-full-winter-gear-on-a-snow-covered-lake-district-fell.webp"
                sizes="(min-width: 832px) 480px, 100vw"
                alt="A well prepared walker on top of a snow-covered mountain"
              />
            </div>
            <div>
              <h3 className={fontStyles.subheading}>Clothing, Equipment and Food</h3>
              <p>
                {/* Bring sturdy boots and waterproof layers for every walk. and dress for the weather. */}
                Bring sturdy boots and waterproofs for every walk, and be prepared for the Lake District&apos;s unpredictable weather.
                Always carry a torch in case you get caught out after dark, and a portable charger to keep your devices working for navigation or emergencies.
                For reliability, a paper map and compass (and the skills to use them) are always recommended.
              </p>
              <b>
                Bring plenty of food and water to keep your energy up, it&apos;s better to have more than you need.
              </b>
            </div>
          </div>

          <div className={styles.group}>
            <div>
              <h3 className={fontStyles.subheading}>Planning and Navigation</h3>
              <p>
                If walking as a group, make sure everyone understands the route and is confident in their own abilities.
                If going solo, always tell someone where you&apos;re heading and when you expect to be back.
                Plan enough time to complete the walk based on you&apos;re own hiking speed and abilities
                and aim to finish well before sunset, especially in winter.
              </p>
              <b>
                Be prepared to turn back if the conditions or your confidence change, the fells will always be there.
              </b>
            </div>
            <div className={styles.image}>
              <LazyImage
                newBase={true}
                name="safety/walker-navigating-a-foggy-lake-district-mountain-top.webp"
                sizes="(min-width: 832px) 480px, 100vw"
                alt="A walker navigating through a foggy mountaintop"
              />
            </div>
          </div>
        </div>
      </section>

      <PageLinkGrid
        pages={[
          {
            title: "Terrain Icons",
            description: "Learn about the icons used to describe the terrain of each walk.",
            href: "/safety/terrain-icons",
            imageSrc: "safety/wainroutes-terrain-icons.webp",
            imageAlt: ""
          },
          {
            title: "Weather Forecast",
            description: "Check the current 5-day mountain weather forecast from the Met Office.",
            href: "/weather",
            imageSrc: "safety/buttermere-lake-with-fleetwith-pike-viewed-from-above.webp",
            imageAlt: ""
          },
          {
            title: "Coming Soon",
            description: "More information and resources are coming to this page soon.",
            href: "#",
            imageSrc: "safety/herdwick-sheep-in-the-mist.webp",
            imageAlt: ""
          },
        ]}
      />


      {/* <section className={styles.linksSection}>
        <div className={styles.links}>
          <h2 className={fontStyles.subheading}>Quick links:</h2>
          <ul>
            <li><a href="https://www.ldsamra.org.uk/_files/ugd/2feb15_39b0289eec314a41a62142942c24e3f3.pdf" target="_blank">#BeAdventureSmart Safety Leaflet</a></li>
            <li><a href="https://www.ldsamra.org.uk/" target="_blank">Lake District Search and Mountain Rescue Association</a></li>
            <li><a href="https://www.lakedistrict.gov.uk/visiting/plan-your-visit/countryside-code" target="_blank">The Countryside Code</a></li>
            <li><a href="https://www.thebmc.co.uk/en/hill-walking" target="_blank">BMC Hill Walking Advice</a></li>
          </ul>
        </div>
      </section> */}


      {/* <section>
        <div>
          <h2 className={fontStyles.heading}>In an Emergency</h2>
          <p>Walking in the Lake District is generally safe, but hiking in the mountains has its risks and those getting involved should be aware and prepared for them.</p>
        </div>
      </section> */}


      {/* <section>
        <div className={styles.checklist}>
          <div>
            <h2 className={fontStyles.heading}>The mountain rescue checklist</h2>
            <p>Ask yourself these three questions before every walk in the Lake District.</p>
          </div>
          <div className={styles.horizontal}>
            <div>
              <h3 className={fontStyles.subheading}>Do I have the right gear?</h3>
              <p>Boots, layers, and other stuff.</p>
            </div>
            <div>
              <h3 className={fontStyles.subheading}>Do I know what the weather will be like?</h3>
              <p>Check <Link href="/weather">the mountain weather forecast</Link> the day before and morning of your planned walk.</p>
            </div>
            <div>
              <h3 className={fontStyles.subheading}>Am I confident that I have the knowledge and skills for the day?</h3>
              <p>Do you know what you&apos;re doing, and confident you can do it.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className={fontStyles.heading}>In an emergency</h2>
          <h3 className={fontStyles.subheading}>Make note of relevant details</h3>
          <p></p>

          <h3 className={fontStyles.subheading}>Dial 999</h3>

        </div>
      </section> */}

    </main>
  )
}