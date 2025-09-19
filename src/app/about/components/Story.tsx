import styles from "../About.module.css";
import fontStyles from "@/styles/fonts.module.css";

import LazyPicture from "@/components/LazyImage/LazyPicture";


export default function Story() {
  return (
      <section>
        <div className={styles.storyContainer}>
          <div className={styles.storyImage}>
            <LazyPicture
              newBase={true}
              names={["about/walla-crag-summit-view-portrait.webp", "about/walla-crag-summit-view-landscape.webp"]}
              widths={[768]}
              sizes="(min-width: 769px) 300px, 100vw"
              alt="Me admiring the view from Walla Crag summit"
            />
          </div>
          <div className={styles.story}>
            <h2 className={fontStyles.heading}>The Story Behind Wainroutes</h2>
            <p>During my final year of university, I started taking regular day-trips to the Lake District. Before that, I&apos;d only visited once, but discovering the 5am train made the fells feel within reach. The Lakes became a place for me to relax, explore, and distract from my work.</p>
            <p>It didn&apos;t take long before I found out about Alfred Wainwright and his series of books on the Lakeland Fells, and I decided to set myself the challenge of climbing all 214, both to satisfy my inner completionist and as an excuse to see as much of the Lakes as possible. I&apos;d spend evenings reading about the fells and planning routes, and weekends introducing everyone I could to them.</p>
            <p>That idea grew into what has become Wainroutes. I wanted a place to bring together all the resources and information I use, and share my routes and photos. Now my aim is to help others discover and enjoy the Lakes as much as I have.</p>
          </div>
        </div>
      </section>
  )
}
