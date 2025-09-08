import styles from "./About.module.css";
import fontStyles from "@/app/fonts.module.css";

import Link from "next/link";
import { createPageMetadata } from "@/utils/metadata";
import Image from "next/image";


export function generateMetadata() {
  return createPageMetadata({
    title: "About Wainroutes",
    description: "Wainroutes is the passion project of Lake District lover Joe Cupit.",
    path: "/about",
  });
}


export default function About() {


  return (
    <main className={styles.aboutPage}>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <Image
            src="/images/terrain.jpg"
            fill={true}
            sizes="100vw"
            alt="Derwentwater"
          />
          <h1 className={`${styles.title} ${fontStyles.heading}`}>About Wainroutes</h1>
        </div>
      </section>

      <section>
        <div className={styles.intro}>
          {/* <h1 className={fontStyles.title}>About Wainroutes</h1> */}
          <b>Wainroutes aims to be your all-in-one site for Wainwright-bagging trips to the Lake District.</b>
        </div>
      </section>

      <section>
        <div className={styles.images}>
          {/* <h2 className={fontStyles.heading}>Exploring without bounds</h2> */}
          <div className={styles.imageGroup}>
            <div className={styles.imageGroupLeft}>
              <div className={`${styles.image} ${styles.twoRow}`}>
                <Image
                  src="/images/about-3.JPEG"
                  fill={true}
                  sizes="(min-width: 1100px): 720px, (min-width: 670px), 70vw, 100vw"
                  alt="The Fairfield Horseshoe in winter conditions"
                />
              </div>
              <div className={`${styles.image}`}>
                <Image
                  src="/images/about-17.JPEG"
                  fill={true}
                  sizes="(min-width: 1100px): 350px, (min-width: 670px), 40vw, 100vw"
                  alt="Looking over Buttermere towards Fleetwith Pike"
                />
              </div>
              <div className={`${styles.image}`}>
                <Image
                  src="/images/about-18.JPEG"
                  fill={true}
                  sizes="(min-width: 1100px): 350px, (min-width: 670px), 40vw, 100vw"
                  alt="A misty Helvellyn summit"
                />
              </div>
            </div>
            <div className={styles.imageGroupRight}>
              <div className={`${styles.image}`}>
                <Image
                  src="/images/P1000074.JPEG"
                  fill={true}
                  sizes="(min-width: 1100px): 240px, (min-width: 670px), 30vw, 100vw"
                  alt="Highland cow"
                />
              </div>
              <div className={`${styles.image}`}>
                <Image
                  src="/images/about-11.JPEG"
                  fill={true}
                  sizes="(min-width: 1100px): 240px, (min-width: 670px), 30vw, 100vw"
                  alt="Seatoller direction sign"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div>

        </div>
      </section>

      <section className={styles.pages}>
        <div className={styles.otherResources}>
          <h2 className={`${fontStyles.heading} visually-hidden`}>Other Resources</h2>
          <div className={styles.pagesCards}>
            <Link href="/safety" className={styles.pagesCard}>
              <div className={styles.pagesCardImage}>
                <Image
                  src="/images/about-safety.JPEG"
                  fill={true}
                  sizes="(min-width: 752px): 26rem, 100vw"
                  alt="Derwentwater"
                />
              </div>
              <div className={styles.pagesCardBody}>
                <h3 className={fontStyles.subheading}>Safety</h3>
                <p>Learn more about staying safe in the mountains in all weather conditions.</p>
              </div>
            </Link>
            <Link href="#" className={styles.pagesCard}>
              <div className={styles.pagesCardImage}>
                <Image
                  src="/images/about-another.JPEG"
                  fill={true}
                  sizes="(min-width: 752px): 26rem, 100vw"
                  alt="Derwentwater"
                />
              </div>
              <div className={styles.pagesCardBody}>
                <h3 className={fontStyles.subheading}>Alfred Wainwright</h3>
                <p>Find out about the man behind the inspiration.</p>
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
                <h3 className={fontStyles.subheading}>Contact</h3>
                <p>Get in touch about the website or ask a question.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div>
        </div>
      </section>

      <div style={{height: "5rem"}}></div>
    </main>
  )
}