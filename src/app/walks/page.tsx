import styles from "./Walks.module.css";
import fontStyles from "@/app/fonts.module.css";

import type Walk from "@/types/Walk";
import { createPageMetadata } from "@/utils/metadata";

import BackToTopButton from "@/app/components/BackToTopButton/BackToTopButton";
import WalksClient from "./components/WalksClient";

import walksJson from "@/data/walks.json";


export function generateMetadata() {
  return createPageMetadata({
    title: "Lake District Walks",
    description: "Find your next Wainwright bagging walk in the Lake District, filtered by distance, elevation, and public transport access.",
    path: "/walks",
  });
}


export type SimpleWalk = {
  slug: string;
  title: string;
  wainwrights: string[];
  length: number;
  elevation: number;
  date?: string,
  gallery: {
    coverId?: string;
  }
  distance?: number;
}


export default function WalksPage() {

  const walksData = (walksJson as unknown as Walk[]).map(walk => ({
    slug: walk.slug,
    title: walk.title,
    wainwrights: walk.wainwrights,
    length: walk.length,
    elevation: walk.elevation,
    date: walk.date,
    gallery: {
      coverId: walk.gallery?.coverId
    }
  } as SimpleWalk));


  return (
    <main className={styles.walks}>
      <BackToTopButton minHeight={600} />

      <section>
        <div className="flex-column">
          <h1 className={fontStyles.title}>Walks in the Lake District</h1>
          <WalksClient
            initialWalks={walksData}
          />
        </div>
      </section>
    </main>
  )
}
