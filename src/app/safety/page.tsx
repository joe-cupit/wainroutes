import styles from "./Safety.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Image from "next/image";

import { createPageMetadata } from "@/utils/metadata";

import BigImageHero from "@/components/BigImageHero/BigImageHero";
import PageLinkGrid from "@/components/PageLinkGrid/PageLinkGrid";


export function generateMetadata() {
  return createPageMetadata({
    title: "Safety in the Lake District",
    description: "Tips for staying safe on the fells of the Lake District, including preparation, clothing, equipment, and navigation tips for your walks.",
    path: "/safety",
    imageURL: "/images/safety-1.JPEG",
  });
}


export default async function Safety() {

  return (
    <main className={styles.page}>
      <BigImageHero
        title="Safety in the Lake District"
        src="/images/safety-1.JPEG"
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
              <Image
                src="/images/safety-3.JPEG"
                fill={true}
                sizes="(min-width: 832px): 480px, 100vw"
                alt="On a mountain top looking towards a setting sun"
              />
            </div>
          </div>

          <div className={`${styles.group} ${styles.reversed}`}>
            <div className={styles.image}>
              <Image
                src="/images/safety-2.JPEG"
                fill={true}
                sizes="(min-width: 832px): 480px, 100vw"
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
              <Image
                src="/images/about-8.JPEG"
                fill={true}
                sizes="(min-width: 832px): 480px, 100vw"
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
            imageSrc: "/images/about-6.JPEG",
            imageAlt: ""
          },
          {
            title: "Weather Forecast",
            description: "Check the current 5-day mountain weather forecast from the Met Office.",
            href: "/weather",
            imageSrc: "/images/about-8.JPEG",
            imageAlt: ""
          },
          {
            title: "Coming Soon",
            description: "More information and resources are coming to this page soon.",
            href: "",
            imageSrc: "/images/about-4.JPEG",
            imageAlt: "A gang of curious sheep on a mountainside"
          },
        ]}
      />

    </main>
  )
}