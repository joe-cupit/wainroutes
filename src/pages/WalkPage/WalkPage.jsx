import "./WalkPage.css";

import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import { NotFoundPage } from "../error/NotFoundPage";

import { useWalks } from "../../hooks/useWalks";
import { displayDistance, displayElevation } from "../../utils/unitConversions";

import { BackIcon, ElevationIcon, HikingIcon, LocationIcon, MountainIcon } from "../../components/Icons";
import Image from "../../components/Image";

import { Summary } from "./components/Summary";
import { Route } from "./components/Route";
import { Waypoints } from "./components/Waypoints";
import { Photos } from "./components/Photos";
import { Weather } from "./components/Weather";

import { StartingLocation } from "./components/StartingLocation";
import { EstimatedTime } from "./components/EstimatedTime";
import { Terrain } from "./components/Terrain";

import { NearbyWalks } from "./components/NearbyWalks";


export function WalkPage() {
  const { slug } = useParams();
  const walkData = useWalks(slug);

  document.title = (walkData?.title ?? "A Lake District Walk") + " | wainroutes";


  if (walkData) return <Walk walkData={walkData} slug={slug} />
  else return <NotFoundPage />
}


function Walk({ walkData, slug }) {

  function scrollToSection(section) {
    if (section == "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    else {
      document.getElementById("walk_"+section.toLowerCase()).scrollIntoView({ behavior: "smooth" });
    }
  }

  const [showOverlay, setShowOverlay] = useState(false)
  const [currentSection, setCurrentSection] = useState("overview")

  const titleRef = useRef(null)
  const overviewRef = useRef(null)
  const routeRef = useRef(null)
  const waypointsRef = useRef(null)
  const photosRef = useRef(null)
  const weatherRef = useRef(null)
  const sections = [
    {section: "overview", ref: overviewRef},
    {section: "route", ref: routeRef},
    {section: "waypoints", ref: waypointsRef},
    {section: "photos", ref: photosRef},
    {section: "weather", ref: weatherRef}
  ]


  
  useEffect(() => {

    function toggleOverlay(e) {
      const currentScroll = e.target.scrollingElement.scrollTop

      if (currentScroll < titleRef?.current?.offsetTop + titleRef?.current?.getBoundingClientRect().height / 2) {
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
          setCurrentSection(null)
        }
      }
    }


    window.addEventListener("scroll", toggleOverlay)

    return () => {
      window.removeEventListener("scroll", toggleOverlay)
    }
  }, [])

  const [asideTabIndex, setAsideTabIndex] = useState(null)
  function toggleAsideTab(newIndex) {
    if (newIndex === asideTabIndex) {
      setAsideTabIndex(null)
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
              <Link to="/walks" title="Back" aria-label="Back to walks"><BackIcon /></Link>
              <div className="walk-page_overlay-title flex-column gap-0">
                <button className="subheading" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{walkData?.title}</button>
                <div className="walk-page_overlay-details flex-row">
                  <span><MountainIcon /> {walkData?.wainwrights?.length}</span>
                  <span><HikingIcon /> {displayDistance(walkData?.length)}</span>
                  <span><ElevationIcon /> {displayElevation(walkData?.elevation)}</span>
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
          <Link to={"/walks?nearto=" + walkData?.startLocation?.location?.toLowerCase().replaceAll(" ", "-")}
            className="walk-page_top-link"
            aria-label={"Walks near " + walkData?.startLocation?.location}
          >
            <LocationIcon /> {walkData?.startLocation?.location}
          </Link>
        </div>
      </section>

      <section>
        <div className="walk-page_heading">
          <h1 className="title" ref={titleRef}>{walkData?.title}</h1>
        </div>

        <div className="walk-page_body grid-two">
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

            <div className={"walk-page_aside-content" + ([1, 2, 3].includes(asideTabIndex) ? " visible" : "")}>
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

          <div className="walk-page_main flex-column flex-1">
            <Summary secRef={overviewRef}
              wainwrights={walkData?.wainwrights}
              length={walkData?.length}
              elevation={walkData?.elevation}
              intro={walkData?.intro}
            />

            <Route secRef={routeRef}
              wainwrights={walkData?.wainwrights}
              center={[walkData?.startLocation?.latitude, walkData?.startLocation?.longitude]}
              slug={slug}
            />

            <Waypoints secRef={waypointsRef}
              waypoints={walkData?.waypoints}
            />

            <Photos secRef={photosRef}
              slug={walkData?.slug}
              galleryData={walkData?.gallery}
            />

            <Weather secRef={weatherRef}
              weatherLoc={walkData?.weatherLoc}
            />
          </div>
        </div>
      </section>

      <NearbyWalks
        location={[walkData?.startLocation?.longitude, walkData?.startLocation?.latitude]}
        currentSlug={slug}
      />
    </main>
    </>
  )
}
