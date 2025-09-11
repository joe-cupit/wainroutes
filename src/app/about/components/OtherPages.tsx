import styles from "../About.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Link from 'next/link'
import Image from 'next/image'


export default function OtherPages() {
  return (
    <section className={styles.pages}>
      <div className={styles.otherResources}>
        <h2 className={`${fontStyles.heading} visually-hidden`}>Other Resources</h2>
        <div className={styles.pagesCards}>
          <Link href="/safety" className={styles.pagesCard}>
            <div className={styles.pagesCardImage}>
              <Image
                src="/images/safety-1.JPEG"
                fill={true}
                sizes="(min-width: 752px): 26rem, 100vw"
                alt="Derwentwater"
              />
            </div>
            <div className={styles.pagesCardBody}>
              <h3 className={fontStyles.subheading}>Safety in the Lakes</h3>
              <p>Learn more about staying safe in the mountains in all weather conditions.</p>
            </div>
          </Link>
          <Link href="/about/alfred-wainwright" className={styles.pagesCard}>
            <div className={styles.pagesCardImage}>
              <Image
                src="/images/about-wainwright.jpg"
                fill={true}
                sizes="(min-width: 752px): 26rem, 100vw"
                alt="Derwentwater"
                style={{
                  objectPosition: "bottom",
                }}
              />
            </div>
            <div className={styles.pagesCardBody}>
              <h3 className={fontStyles.subheading}>Alfred Wainwright</h3>
              <p>Find out about the man behind the books.</p>
            </div>
          </Link>
          <Link href="/contact" className={styles.pagesCard}>
            <div className={styles.pagesCardImage}>
              <Image
                src="/images/about-contact-4.jpg"
                fill={true}
                sizes="(min-width: 752px): 26rem, 100vw"
                alt="Derwentwater"
              />
            </div>
            <div className={styles.pagesCardBody}>
              <h3 className={fontStyles.subheading}>Get in Touch</h3>
              <p>Get in touch about the website or ask a question.</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
