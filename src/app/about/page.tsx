import styles from "./About.module.css";

import { createPageMetadata } from "@/utils/metadata";

import BigImageHero from "@/components/BigImageHero/BigImageHero";
import PageLinkGrid from "@/components/PageLinkGrid/PageLinkGrid";

import Intro from "./components/Intro";
import ImageGrid from "./components/ImageGrid";
import Story from "./components/Story";
import Features from "./components/Features";
import Support from "./components/Support";


export function generateMetadata() {
  return createPageMetadata({
    title: "About",
    description: "Wainroutes makes planning walks in the Lake District easier and more enjoyable, with detailed routes and maps, mountain weather forecasts, and photos.",
    path: "/about",
    imageURL: "https://images.wainroutes.co.uk/about/walking-the-dog-on-derwentwater-at-sunset_1024w.webp",
  });
}


export default function About() {

  return (
    <main className={styles.page}>
      <BigImageHero
        title="About Wainroutes"
        src="about/walking-the-dog-on-derwentwater-at-sunset.webp"
        alt="Derwentwater"
      />

      <Intro />
      <ImageGrid />
      <Story />
      <Features />

      <PageLinkGrid
        title="Other Resources"
        pages={[
          {
            title: "Safety in the Lakes",
            description: "Learn more about staying safe in the mountains in all weather conditions.",
            href: "/safety",
            imageSrc: "safety/walker-scrambling-the-final-section-of-striding-edge-thumb.webp",
            imageAlt: "A climber scrambling the final section of Striding Edge"
          },
          {
            title: "Alfred Wainwright",
            description: "Find out about the man behind the books.",
            href: "/about/alfred-wainwright",
            imageSrc: "about/innominate-tarn-on-a-sunny-day.webp",
            imageAlt: "Innominate Tarn on a sunny day"
          },
          {
            title: "Get in Touch",
            description: "Get in touch about the website or ask a question.",
            href: "/contact",
            imageSrc: "contact/curious-sheep-on-a-lake-district-mountainside-thumb.webp",
            imageAlt: "A gang of curious sheep on a mountainside"
          },
        ]}
      />

      <Support />

    </main>
  )
}