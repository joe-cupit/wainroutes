import styles from "./Contact.module.css";
import fontStyles from "@/app/fonts.module.css";

import Link from "next/link";
import { createPageMetadata } from "@/utils/metadata";


export function generateMetadata() {
  return createPageMetadata({
    title: "Get in touch",
    description: "",
    path: "/contact",
  });
}


export default function Contact() {

  return (
    <main className={styles.main}>
      <section>
        <div className={styles.contact}>
          <h1 className={fontStyles.title}>Get in touch</h1>

          <p>
            I&apos;m always happy to hear from users of the site, whether that be feedback or recommendations for walks, so you can send me an email at <a href="mailto:joe@wainroutes.co.uk">joe@wainroutes.co.uk</a>.
          </p>

          <p>
            Before asking a question, check the list of <Link href="/faq">frequently asked questions</Link> to see if it has been answered already.
          </p>

        </div>
      </section>
    </main>
  )
}