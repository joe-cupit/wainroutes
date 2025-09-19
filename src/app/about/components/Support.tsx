import styles from "../About.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Link from "next/link";

import LazyImage from "@/components/LazyImage/LazyImage";
import TipButton from "@/components/Tips/TipButton";


export default function Support() {
  return (
    <section>
      <div className={styles.supportContainer}>
        <div className={styles.support}>
          <h2 className={fontStyles.heading}>Supporting Wainroutes</h2>
          <p>Wainroutes is a passion project, and I don&apos;t make money from it. There are, however, costs involved in keeping the site running. If you&apos;ve found it useful and would like to help keep me going, you can <Link href="/about/support" className={styles.link}>find out more about supporting the site</Link> or donate using the button below.</p>
          <TipButton />
        </div>
        <div className={styles.supportImage}>
          <LazyImage
            newBase={true}
            name="about/a-herdwick-sheep-on-a-hillside.webp"
            sizes="(min-width: 832px) 480px, 100vw"
            alt="A Herdwick sheep on a hillside"
          />
        </div>
      </div>
    </section>
  )
}
