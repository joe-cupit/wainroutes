import styles from "./BigImageHero.module.css";
import fontStyles from "@/styles/fonts.module.css";

import LazyImage from "../LazyImage/LazyImage";
import LazyPicture from "../LazyImage/LazyPicture";


type BigImageHeroProps = {
  title: string
  src: string
  srcSmall?: string
  alt?: string
}


export default function BigImageHero({ title, src, srcSmall, alt } : BigImageHeroProps) {
  return (
    <section className={styles.section}>
      <div className={styles.hero}>
        {srcSmall
        ? <LazyPicture
            newBase={true}
            className={styles.image}
            names={[src, srcSmall]}
            widths={[700]}
            sizes="100vw"
            alt={alt}
          />
        : <LazyImage
            newBase={true}
            className={styles.image}
            name={src}
            sizes="100vw"
            alt={alt}
          />
        }
        
        <h1 className={`${styles.title} ${fontStyles.title}`}>{title}</h1>
      </div>
    </section>
  )
}
