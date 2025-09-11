import styles from "../About.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Image from "next/image";


export default function Story() {
  return (
      <section>
        <div className={styles.storyContainer}>
          <div className={styles.storyImage}>
            <Image
              src="/images/about-story.JPEG"
              fill={true}
              sizes="(min-width: 640px): 300px, 100vw"
              alt="ME"
            />
          </div>
          <div className={styles.story}>
            <h2 className={fontStyles.heading}>The Story Behind Wainroutes</h2>
            <p>During my final year of university in Manchester, I started taking regular day-trips to the Lake District. Before that, I'd only visited once, but discovering the 5am train made it easy to keep returning. The Lakes became a place to relax, explore, and distract from my work.</p>
            <p>It didn't take long before I found out about Alfred Wainwright and his series of books on the Lakeland Fells, and I set myself the challenge of climbing them all 214, both to satisfy my inner completionist and as an excuse to see as much of the Lakes as possible. I'd spend evenings reading about the fells, planning routes, and dreaming up my next trip.</p>
            <p>Wainroutes grew out of that passion. I wanted to bring together all the resources and information I use into one place, where I could share my routes, photos, and tips.</p>
            <p>I hope it proves useful for fellow walkers as well.</p>
          </div>
        </div>
      </section>
  )
}
