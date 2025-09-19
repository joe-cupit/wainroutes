import styles from "./PageLinkGrid.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Link from 'next/link';

import LazyImage from "../LazyImage/LazyImage";


type Page = {
  title: string
  description: string
  href: string
  imageSrc: string
  imageAlt?: string
}

type OtherPagesProps = {
  title?: string
  pages: Page[]
}

export default function PageLinkGrid({ title, pages } : OtherPagesProps ) {
  return (
    <section className={styles.pagesSection}>
      <div className={styles.pages}>
        <h2 className={`${fontStyles.heading} visually-hidden`}>{title || "Other Resources"}</h2>
        <div className={styles.pagesGrid}>
          {pages.map((page, index) => (
            <PageCard key={index} page={page} />
          ))}
        </div>
      </div>
    </section>
  )
}


function PageCard({ page } : { page: Page }) {
  return (
    <Link href={page.href} className={styles.card} title={page.title}>
      <div className={styles.cardImage}>
        <LazyImage
          newBase={true}
          name={page.imageSrc}
          sizes="(min-width: 47rem) 26rem, 100vw"
          alt={page.imageAlt}
        />
      </div>
      <div className={styles.cardBody}>
        <h3 className={fontStyles.subheading}>{page.title}</h3>
        <p>{page.description}</p>
      </div>
    </Link>
  )
}
