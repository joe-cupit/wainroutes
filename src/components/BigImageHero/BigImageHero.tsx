import styles from "./BigImageHero.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Image from "next/image";


type BigImageHeroProps = {
  title: string
  src: string
  alt?: string
}


export default function BigImageHero({ title, src, alt } : BigImageHeroProps) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.hero}>
        <Image
          src={src}
          fill={true}
          sizes="100vw"
          alt={alt ?? ""}
        />
        <h1 className={`${styles.title} ${fontStyles.title}`}>{title}</h1>
      </div>
    </section>
  )
}
