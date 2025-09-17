import styles from "./Walk.module.css";

import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/utils/metadata";

import Summary from "./components/Summary";
import Route from "./components/Route";
import Waypoints from "./components/Waypoints";
import Photos from "./components/Photos";
import Weather from "./components/Weather";
import NearbyWalks from "./components/NearbyWalks";
import Overlay from "./components/Overlay";
import WalkAside from "./components/Aside";

import type Walk from "@/types/Walk";
import LazyImage from "@/components/LazyImage/LazyImage";
import { displayDistance, displayElevation } from "@/utils/unitConversions";
import { LocationIcon } from "@/icons/MaterialIcons";

import walksJson from "@/data/walks.json";


type WalkProps = {
  params: Promise<{ slug: string }>
}


export async function generateMetadata({ params } : WalkProps) {
  const { slug }  = await params;
  const walkData = (walksJson as unknown as Walk[]).find(w => w.slug === slug);
  if (!walkData) return {};

  const title = `${walkData.title} (${walkData.length}km) – Lake District Walk & Route Guide`;
  const description = `Route details for ${walkData.title}, a Lake District walk featuring ${walkData.wainwrights.length} Wainwright${walkData.wainwrights.length !== 1 ? "s" : ""}, with maps, terrain info, and photos.`
  const path = `/walks/${walkData.slug}`;
  const imageURL = `https://images.wainroutes.co.uk/wainroutes_${walkData.slug}_${walkData.gallery?.coverId}_1024w.webp`;

  return createPageMetadata({
    title, description, path, imageURL
  });
}


export function generateStaticParams() {
  const walks = walksJson as unknown as Walk[];

  return walks.map(walk => ({slug: walk.slug}));
}


export default async function WalkPage({ params } : WalkProps) {

  const { slug }  = await params;

  const walkData = (walksJson as unknown as Walk[]).find(w => w.slug === slug);
  if (!walkData) {
    return notFound();
  }


  return (
    <main className={styles.walk}>

      <Overlay
        walkData={{
          title: walkData.title ?? "",
          wainwrightCount: walkData.wainwrights.length ?? 0,
          lengthString: displayDistance(walkData.length),
          elevationString: displayElevation(walkData.elevation)
        }}
      />

      <section>
        <div className={styles.top}>
          <div className={styles.topImage}>
            <LazyImage
              name={walkData.slug + "_" + walkData.gallery?.coverId}
              sizes="(min-width: 1100px) 1100px, 100vw"
            />
          </div>
          <div className={styles.topBlock}></div>
          {walkData.startLocation?.location && 
            <Link href={"/walks?town=" + walkData.startLocation.location.toLowerCase().replaceAll(" ", "-")}
              className={styles.topLink}
              aria-label={"Walks near " + walkData.startLocation.location}
            >
              <LocationIcon /> {walkData.startLocation.location}
            </Link>
          }
        </div>
      </section>

      <section>
        <div className={styles.body}>
          <div className={styles.main}>
            <Summary
              title={walkData.title ?? ""}
              wainwrights={walkData.wainwrights ?? []}
              length={walkData.length ?? 0}
              elevation={walkData.elevation ?? 0}
              intro={walkData.intro}
            />

            <Route
              wainwrights={walkData.wainwrights ?? []}
              defaultCenter={[walkData.startLocation?.latitude ?? 0, walkData.startLocation?.longitude ?? 0]}
              slug={slug}
            />

            {Object.keys(walkData.waypoints ?? {}).length > 0 &&
              <Waypoints
                waypoints={walkData.waypoints}
              />
            }

            <Photos
              slug={slug}
              galleryData={walkData.gallery}
            />

            {walkData.weatherLoc &&
              <Weather
                weatherLoc={walkData.weatherLoc}
              />
            }
          </div>

          <WalkAside
            startLocation={walkData.startLocation}
            busConnections={walkData.busConnections}
            walkLength={walkData.length}
            terrain={walkData.terrain}
          />
        </div>

        <NearbyWalks
          location={[walkData.startLocation?.longitude ?? 0, walkData.startLocation?.latitude ?? 0]}
          currentSlug={slug}
        />

        <div className={styles.note}>
          <p>
            These routes are for guidance only.
            Always check the weather, wear appropriate clothing, and know your limits.
            See the <Link href="/safety">safety page</Link> for the more advice before setting out.
          </p>
        </div>
      </section>

    </main>
  )
}
