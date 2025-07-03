import "./WalkPage.css";

import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import { NotFoundPage } from "../error/NotFoundPage";

import { useWalk } from "../../contexts/WalksContext";
import setPageTitle from "../../hooks/setPageTitle";
import { BackIcon, ElevationIcon, HikingIcon, LocationIcon, MountainIcon } from "../../components/Icons";
import Image from "../../components/Image";
import { displayDistance, displayElevation } from "../../utils/unitConversions";

import { Summary } from "./components/Summary";
import { Route } from "./components/Route";
import { Waypoints } from "./components/Waypoints";
import { Photos } from "./components/Photos";
import { Weather } from "./components/Weather";

import { StartingLocation } from "./components/StartingLocation";
import { EstimatedTime } from "./components/EstimatedTime";
import { Terrain } from "./components/Terrain";

import { NearbyWalks } from "./components/NearbyWalks";


export type WalkGallery = {
  imageIds: string[];
  imageData: {
    title: string;
    caption: string;
  }[]
  coverId: string;
  sections: {
    type: number;
    indexes: number[]
  }[]
}

export type Walk = {
  slug: string;

  title: string;
  type?: string;
  summary?: string;
  wainwrights?: string[];
  length?: number;
  elevation?: number;
  estimatedTime?: string;
  date?: string;

  startLocation?: {
    location: string;
    latitude?: number;
    longitude?: number;
    postCode?: string;
    gridRef?: string;
  }
  busConnections?: {
    [number: string]: string;
  }
  terrain?: {
    gradient?: number;
    path?: number;
    exposure?: number;
    desc?: string;
  }

  intro?: string;
  waypoints?: {
    [name: string]: string;
  }
  gallery?: WalkGallery;

  weatherLoc?: string;
  tags: string[];

  distance?: number;
  // distanceFromLocation?: number;
}


export function WalkPage() {
  const { slug } = useParams();
  const { walkData, walkLoading } = useWalk(slug);

  setPageTitle(walkData?.title ?? "A Lake District Walk");

  if (walkLoading) return <WalkSkeleton />
  else {
    if (walkData) return <Walk walkData={walkData} />
    else return <NotFoundPage />
  }
}


function Walk({ walkData } : { walkData: Walk }) {

  function scrollToSection(section: string) {
    if (section == "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    else {
      document.getElementById("walk_"+section.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const [showOverlay, setShowOverlay] = useState(false)
  const [currentSection, setCurrentSection] = useState("overview")

  const titleRef = useRef<HTMLHeadingElement>(null)
  const overviewRef = useRef<HTMLDivElement>(null)
  const routeRef = useRef<HTMLDivElement>(null)
  const waypointsRef = useRef<HTMLDivElement>(null)
  const photosRef = useRef<HTMLDivElement>(null)
  const weatherRef = useRef<HTMLDivElement>(null)
  const sections = [
    {section: "overview", ref: overviewRef},
    {section: "route", ref: routeRef},
    {section: "waypoints", ref: waypointsRef},
    {section: "photos", ref: photosRef},
    {section: "weather", ref: weatherRef}
  ]


  useEffect(() => {

    function toggleOverlay() {
      const currentScroll = document.scrollingElement?.scrollTop ?? 0;

      if (currentScroll < (titleRef.current?.offsetTop ?? 0) + (titleRef.current?.getBoundingClientRect()?.height ?? 0) / 2) {
        setShowOverlay(false)
        setCurrentSection("overview")
      }
      else {
        setShowOverlay(true)

        const selected = sections.find(({ ref }) => {
          const ele = ref.current
          if (ele) {
            return currentScroll + 60 < (ele.offsetTop + ele.getBoundingClientRect().height)
          }
        })

        if (selected) {
          setCurrentSection(selected.section)
        }
        else {
          setCurrentSection("")
        }
      }
    }


    window.addEventListener("scroll", toggleOverlay)

    return () => {
      window.removeEventListener("scroll", toggleOverlay)
    }
  }, [])

  const [asideTabIndex, setAsideTabIndex] = useState(-1)
  function toggleAsideTab(newIndex: number) {
    if (newIndex === asideTabIndex) {
      setAsideTabIndex(-1)
    }
    else {
      setAsideTabIndex(newIndex)
    }
  }


  return (
    <>
    <main className="walk-page">

      <div className={"walk-page_overlay" + (showOverlay ? " show" : "")}>
        <section>
          <div className="walk-page_overlay-wrapper flex-row flex-apart wrap-none">
            <div className="walk-page_overlay-left flex-1 flex-row align-center wrap-none" // className="flex-1 flex-row align-center wrap-none"
            >
              <button title="Back" aria-label="Back to walks" onClick={() => history.back()}><BackIcon /></button>
              <div className="walk-page_overlay-title flex-column gap-0">
                <button className="subheading" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{walkData?.title}</button>
                <div className="walk-page_overlay-details flex-row">
                  <span><MountainIcon /> {walkData?.wainwrights?.length ?? 0}</span>
                  <span><HikingIcon /> {displayDistance(walkData?.length ?? 0)}</span>
                  <span><ElevationIcon /> {displayElevation(walkData?.elevation ?? 0)}</span>
                </div>
              </div>
            </div>

            <div className="walk-page_overlay-nav flex-row wrap-none">
              {sections.map((sec, index) => {
                return (
                  <button key={index} 
                    onClick={() => scrollToSection(sec.section)}
                    className={(currentSection == sec.section ? "active" : "")}
                  >
                    {sec.section.charAt(0).toUpperCase() + sec.section.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="walk-page_top" style={{backgroundImage: `url(/images/${walkData?.slug}-small.jpg)`}}>
          <Image
            className="walk-page_top-image"
            name={walkData?.slug + "_" + walkData?.gallery?.coverId}
            sizes="(min-width: 1100px) 1100px, 100vw"
          />
          <div className="walk-page_top-block"></div>
          <Link to={"/walks?town=" + walkData?.startLocation?.location?.toLowerCase().replaceAll(" ", "-")}
            className="walk-page_top-link"
            aria-label={"Walks near " + walkData?.startLocation?.location}
          >
            <LocationIcon /> {walkData?.startLocation?.location}
          </Link>
        </div>
      </section>

      <section>
        <div className="walk-page_body">
          <div className="walk-page_main flex-column flex-1">
            <Summary secRef={overviewRef}
              title={walkData?.title}
              titleRef={titleRef}
              wainwrights={walkData?.wainwrights}
              length={walkData?.length}
              elevation={walkData?.elevation}
              intro={walkData?.intro}
            />

            <Route secRef={routeRef}
              wainwrights={walkData?.wainwrights}
              center={[walkData?.startLocation?.latitude ?? 0, walkData?.startLocation?.longitude ?? 0]}
              slug={walkData?.slug}
            />

            {Object.keys(walkData?.waypoints ?? {}).length > 0 &&
              <Waypoints secRef={waypointsRef}
                waypoints={walkData?.waypoints}
              />
            }

            <Photos secRef={photosRef}
              slug={walkData?.slug}
              galleryData={walkData?.gallery}
            />

            <Weather secRef={weatherRef}
              weatherLoc={walkData?.weatherLoc}
            />
          </div>

          <div className="walk-page_aside flex-column">
            <div className="walk-page_aside-tabs flex-row gap-0">
              <button
                className={"walk-page_aside-tab" + (asideTabIndex === 1 ? " selected" : "")}
                onClick={() => toggleAsideTab(1)}
              >
                Start Loc
              </button>
              <button 
                className={"walk-page_aside-tab" + (asideTabIndex === 2 ? " selected" : "")}
                onClick={() => toggleAsideTab(2)}
              >
                Est Time
              </button>
              <button 
                className={"walk-page_aside-tab" + (asideTabIndex === 3 ? " selected" : "")}
                onClick={() => toggleAsideTab(3)}
              >
                Terrain
              </button>
            </div>

            <div className="walk-page_aside-image">
              <Image
                name={walkData?.slug + "_" + walkData?.gallery?.coverId}
                sizes="(min-width: 300px) 300px, 90vw"
              />
            </div>

            <div className={"walk-page_aside-content flex-column" + ([1, 2, 3].includes(asideTabIndex) ? " visible" : "")}>
              <StartingLocation selected={asideTabIndex === 1}
                startLocation={walkData?.startLocation}
                busRoutes={walkData?.busConnections}
              />
              <EstimatedTime selected={asideTabIndex === 2}
                walkLengthInKm={walkData?.length}
              />
              <Terrain selected={asideTabIndex === 3}
                walkTerrain={walkData?.terrain}
              />
            </div>
          </div>
        </div>
      </section>

      <NearbyWalks
        location={[walkData?.startLocation?.longitude ?? 0, walkData?.startLocation?.latitude ?? 0]}
        currentSlug={walkData?.slug}
      />
    </main>
    </>
  )
}


function WalkSkeleton() {
  return (
    <>
    <main className="walk-page">

      <section>
        <div className="walk-page_top">
          <div className="walk-page_top-image" />
          <div className="walk-page_top-block"></div>
        </div>
      </section>

      <section>
        <div className="walk-page_body">
          <div className="walk-page_main flex-column flex-1">

          </div>

          <div className="walk-page_aside flex-column">
            <div className="walk-page_aside-tabs flex-row gap-0">

            </div>

            <div className="walk-page_aside-image">

            </div>

            <div className={"walk-page_aside-content flex-column"}>

            </div>
          </div>
        </div>
      </section>

    </main>
    </>
  )
}
