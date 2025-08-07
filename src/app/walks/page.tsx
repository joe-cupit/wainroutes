import styles from "./Walks.module.css";
import fontStyles from "@/app/fonts.module.css";

import type Walk from "@/types/Walk";
import { createPageMetadata } from "@/utils/metadata";

import BackToTopButton from "@/app/components/BackToTopButton/BackToTopButton";
import WalksClient from "./components/WalksClient";

import walksJson from "@/data/walks.json";
import wainsJson from "@/data/hills.json";
import { locations } from "./components/WalkFilterValues";


type MetadataProps = {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>
}

export async function generateMetadata({ searchParams } : MetadataProps) {

  const { town } = await searchParams;

  if (town && locations[town]) {
    const location = locations[town];
    return createPageMetadata({
      title: `Lake District Walks near ${location.name}`,
      description: `Find your next Wainwright bagging walk near ${location.name}, filtered by distance, elevation, and public transport access.`,
      path: `/walks?town=${town}`,
    });
  }
  else {
    return createPageMetadata({
      title: "Lake District Walks",
      description: "Find your next Wainwright bagging walk in the Lake District, filtered by distance, elevation, and public transport access.",
      path: "/walks",
    });
  }
}


export type SimpleWalk = {
  slug: string;
  title: string;
  wainwrights: string[];
  length: number;
  elevation: number;
  date?: string;
  startLocation?: {
    latitude?: number;
    longitude?: number;
  }
  busConnections?: Walk["busConnections"];
  gallery: {
    coverId?: string;
  }
  distance?: number;
}


export default async function WalksPage({ searchParams } : MetadataProps) {

  const { town } = await searchParams;

  const simplifiedWalks = (walksJson as unknown as Walk[]).map(walk => ({
    slug: walk.slug,
    title: walk.title,
    wainwrights: walk.wainwrights,
    length: walk.length,
    elevation: walk.elevation,
    date: walk.date,
    startLocation: {
      latitude: walk.startLocation?.latitude,
      longitude: walk.startLocation?.longitude,
    },
    busConnections: walk.busConnections,
    gallery: {
      coverId: walk.gallery?.coverId
    },
  } as SimpleWalk));


  return (
    <main className={styles.walks}>
      <BackToTopButton minHeight={600} />

      <section>
        <div className="flex-column">
          <h1
            id="walks-title"
            className={fontStyles.title}
          >
            {(town && locations[town])
              ? `Walks near ${locations[town].name}`
              : "Walks in the Lake District"
            }
          </h1>
          <WalksClient
            allWalks={simplifiedWalks}
            wainNames={wainNames}
          />
        </div>
      </section>
    </main>
  )
}
