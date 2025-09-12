import styles from "./Contact.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Link from "next/link";
import Image from "next/image";

import { createPageMetadata } from "@/utils/metadata";
import BigImageHero from "@/components/BigImageHero/BigImageHero";


export function generateMetadata() {
  return createPageMetadata({
    title: "Get in Touch",
    description: "Contact Wainroutes.",
    path: "/contact",
  });
}


export default async function Contact() {

  return (
    <main className={styles.page}>
      <BigImageHero
        title="Get in Touch"
        src="/images/contact.JPEG"
        alt="A gang of curious sheep on a mountainside"
      />

      <section>
        <div className={styles.intro}>
          <h2 className={fontStyles.heading}>Contact me</h2>
          <p></p>
        </div>
      </section>

      <section className={styles.linkCardsSection}>
        <div className={styles.linkCards}>
          <h2 className={`${fontStyles.heading} visually-hidden`}>Other Resources</h2>
          <div className={styles.threeCards}>
            <Link href="/about" className={styles.linkCard}>
              <div className={styles.linkCardImage}>
                <Image
                  src="/images/terrain.jpg"
                  fill={true}
                  sizes="(min-width: 752px): 26rem, 100vw"
                  alt="Derwentwater"
                />
              </div>
              <div className={styles.linkCardBody}>
                <h3 className={fontStyles.subheading}>About Wainroutes</h3>
                <p>Find out more about the site and what's available.</p>
              </div>
            </Link>
            <Link href="/about/faq" className={styles.linkCard}>
              <div className={styles.linkCardImage}>
                <Image
                  src="/images/about-1.JPEG"
                  fill={true}
                  sizes="(min-width: 752px): 26rem, 100vw"
                  alt="Derwentwater"
                />
              </div>
              <div className={styles.linkCardBody}>
                <h3 className={fontStyles.subheading}>FAQs</h3>
                <p>Frequently asked questions.</p>
              </div>
            </Link>
            <Link href="#" className={styles.linkCard}>
              <div className={styles.linkCardImage}>
                <Image
                  src="/images/about-4.JPEG"
                  fill={true}
                  sizes="(min-width: 752px): 26rem, 100vw"
                  alt="Derwentwater"
                />
              </div>
              <div className={styles.linkCardBody}>
                <h3 className={fontStyles.subheading}>Other Resources</h3>
                <p>Something else.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}