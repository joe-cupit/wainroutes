import styles from "../About.module.css";
import Image from "next/image";


export default function ImageGrid() {
  return (
    <section>
      <div className={styles.images}>
        {/* <h2 className={fontStyles.heading}>Exploring without bounds</h2> */}
        <div className={styles.imageGroup}>
          <div className={styles.imageGroupLeft}>
            <div className={`${styles.image} ${styles.twoRow}`}>
              <Image
                src="/images/about-3.JPEG"
                fill={true}
                sizes="(min-width: 1100px): 720px, (min-width: 670px): 70vw, 100vw"
                alt="The Fairfield Horseshoe in winter conditions"
              />
            </div>
            <div className={`${styles.image}`}>
              <Image
                src="/images/about-17.JPEG"
                fill={true}
                sizes="(min-width: 1100px): 350px, (min-width: 670px): 40vw, 100vw"
                alt="Looking over Buttermere towards Fleetwith Pike"
              />
            </div>
            <div className={`${styles.image}`}>
              <Image
                src="/images/about-18.JPEG"
                fill={true}
                sizes="(min-width: 1100px): 350px, (min-width: 670px): 40vw, 100vw"
                alt="A misty Helvellyn summit"
              />
            </div>
          </div>
          <div className={styles.imageGroupRight}>
            <div className={`${styles.image}`}>
              <Image
                src="/images/P1000074.JPEG"
                fill={true}
                sizes="(min-width: 1100px): 240px, (min-width: 670px): 30vw, 100vw"
                alt="Highland cow"
              />
            </div>
            <div className={`${styles.image}`}>
              <Image
                src="/images/about-11.JPEG"
                fill={true}
                sizes="(min-width: 1100px): 240px, (min-width: 670px): 30vw, 100vw"
                alt="Seatoller direction sign"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
