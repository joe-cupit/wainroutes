import styles from "../About.module.css";

import LazyImage from "@/components/LazyImage/LazyImage";


export default function ImageGrid() {
  return (
    <section>
      <div className={styles.images}>
        {/* <h2 className={fontStyles.heading}>Exploring without bounds</h2> */}
        <div className={styles.imageGroup}>
          <div className={styles.imageGroupLeft}>
            <div className={`${styles.image} ${styles.twoRow}`}>
              <LazyImage
                newBase={true}
                name="about/a-walker-admiring-a-lake-district-view-in-winter-conditions.webp"
                sizes="(min-width: 1100px) 720px, (min-width: 670px) 70vw, 100vw"
                alt="The Fairfield Horseshoe in winter conditions"
              />
            </div>
            <div className={`${styles.image}`}>
              <LazyImage
                newBase={true}
                name="about/fleetwith-pike-at-the-end-of-buttermere-lake.webp"
                sizes="(min-width: 1100px) 350px, (min-width: 670px) 40vw, 100vw"
                alt="Looking over Buttermere lake towards Fleetwith Pike"
              />
            </div>
            <div className={`${styles.image}`}>
              <LazyImage
                newBase={true}
                name="about/hikers-on-helvellyn-summit-in-fog.webp"
                sizes="(min-width: 1100px) 350px, (min-width: 670px) 40vw, 100vw"
                alt="Walkers on a foggy Helvellyn summit"
              />
            </div>
          </div>
          <div className={styles.imageGroupRight}>
            <div className={`${styles.image}`}>
              <LazyImage
                newBase={true}
                name="about/a-young-highland-cow-in-the-lake-district.webp"
                sizes="(min-width: 1100px) 260px, (min-width: 670px) 30vw, 100vw"
                alt="A young highland cow in the Lake District"
              />
            </div>
            <div className={`${styles.image}`}>
              <LazyImage
                newBase={true}
                name="about/seatoller-old-direction-post.webp"
                sizes="(min-width: 1100px) 260px, (min-width: 670px) 30vw, 100vw"
                alt="Seatoller direction post"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
