import styles from "./About.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Image from "next/image";
import { createPageMetadata } from "@/utils/metadata";

import Intro from "./components/Intro";
import ImageGrid from "./components/ImageGrid";
import Story from "./components/Story";
import Features from "./components/Features";
import OtherPages from "./components/OtherPages";
import Support from "./components/Support";


export function generateMetadata() {
  return createPageMetadata({
    title: "About",
    description: "Wainroutes is the passion project of Lake District lover Joe Cupit.",
    path: "/about",
  });
}


export default function About() {

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <Image
            src="/images/terrain.jpg"
            fill={true}
            sizes="100vw"
            alt="Derwentwater"
          />
          <h1 className={`${styles.title} ${fontStyles.title}`}>About Wainroutes</h1>
        </div>
      </section>

      <Intro />
      <ImageGrid />
      <Story />
      <Features />

      <OtherPages />

      <Support />

    </main>
  )
}