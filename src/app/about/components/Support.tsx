import styles from "../About.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Link from "next/link";
import TipButton from "@/components/Tips/TipButton";
import Image from "next/image";


export default function Support() {
  return (
    <section>
      <div className={styles.supportContainer}>
        <div className={styles.support}>
          <h2 className={fontStyles.heading}>Supporting Wainroutes</h2>
          <p>Wainroutes is a passion project, and I don't make money from it. There are, however, costs involved in keeping the site running. If you've found it useful and would like to help keep me going, you can <Link href="/about/support" className={styles.link}>find out more about supporting the site</Link> or donate using the button below.</p>
          <TipButton />
        </div>
        <div className={styles.supportImage}>
          <Image
            src="/images/about-support.JPEG"
            fill={true}
            sizes="(min-width: 832px): 480px, 100vw"
            alt="sheep"
          />
        </div>
      </div>
    </section>
  )
}
