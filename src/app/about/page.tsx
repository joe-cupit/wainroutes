import styles from "./About.module.css";

import { createPageMetadata } from "@/utils/metadata";

import BigImageHero from "@/components/BigImageHero/BigImageHero";
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
      <BigImageHero
        title="About Wainroutes"
        src="/images/terrain.jpg"
        alt="Derwentwater"
      />

      <Intro />
      <ImageGrid />
      <Story />
      <Features />

      <OtherPages />

      <Support />

    </main>
  )
}