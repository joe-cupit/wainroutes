import styles from "./Support.module.css"
import fontStyles from "@/styles/fonts.module.css"

import { createPageMetadata } from "@/utils/metadata"

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import TipWidget from "@/components/Tips/TipWidget"
import TipLink from "@/components/Tips/TipLink"
import LazyImage from "@/components/LazyImage/LazyImage"


export function generateMetadata() {
  return createPageMetadata({
    title: "Support",
    description: "Support the growth and upkeep of Wainroutes, keeping its free routes, guides, and resources for Lake District walks avaiable to all.",
    path: "/about/support",
  });
}


export default function page() {
  return (
    <main className={styles.page}>
      <section>
        <div>
          <Breadcrumbs
            crumbs={{
              "About": "/about",
              "Support": "/about/support",
            }}
          />
          <div className={styles.main}>
            <div className={styles.text}>
              <h1 className={fontStyles.heading}>Support Wainroutes</h1>
              <p>
                Everything on Wainroutes is provided free for all users, and I plan to keep it that way.
                However, there are costs involved in hosting the site, providing GPX files, and continuing to develop new guides and features.
              </p>
              <p>
                If you&apos;ve enjoyed using the site or found the routes useful and would like to support its growth and upkeep, you can donate using the widget below or by <TipLink>following this link</TipLink>.
                Every contribution helps me to continue adding routes, guides, and new resources.
              </p>
              <div>
                <p>Thank you for your support, <br/>Joe</p>
              </div>
              <div className={styles.image}>
                <LazyImage
                  newBase={true}
                  name="support/lake-district-fells-on-a-misty-morning.webp"
                  sizes="(min-width: 1250px) 780px, 70vw"
                  alt="Misty morning mountains behind a cobblestone wall"
                />
              </div>
            </div>

            <TipWidget />
          </div>
        </div>
      </section>
    </main>
  )
}
