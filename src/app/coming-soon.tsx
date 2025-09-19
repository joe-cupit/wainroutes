import styles from "@/styles/coming-soon.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Link from "next/link";

import WalkRoulette from "@/components/WalkRoulette/WalkRoulette";


export default function ComingSoon({ description } : { description?: string}) {
  return (
    <main className={styles.page}>
      <section>
        <div className={styles.main}>
          <h1 className={fontStyles.title}>Coming soon!</h1>
          <p>{description || "I'm still working on this page!"}</p>

          <div>
            <p>In the meantime, why not check out one of these other pages?</p>
            <ul>
              <li><Link href="/walks">Find a walk</Link></li>
              <li><Link href="/about">About Wainroutes</Link></li>
              <li><Link href="/wainwrights">The Wainwrights</Link></li>
            </ul>
          </div>
        </div>

      </section>

      <section>
        <div className={styles.roulette}>
          <h2 className={fontStyles.subheading}>Or... get given a randomly selected walk!</h2>
          <WalkRoulette />
        </div>
      </section>
    </main>
  )
}
