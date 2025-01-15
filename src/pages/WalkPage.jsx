import "./WalkPage.css";

import { useState, useEffect, Fragment, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { useHills } from "../hooks/useHills";
import { useWalks } from "../hooks/useWalks";

import { LakeMap, GeoRoute } from "../components/map";
import { useHillMarkers } from "../hooks/useMarkers";
import ElevationChart from "../components/ElevationChart";
import haversine from "../utils/haversine";
import WalkCard from "../components/WalkCard";
import { displayDistance, displayElevation } from "../utils/unitConversions";


const WeatherSymbolsFolder = import.meta.glob("../assets/images/weather/*.svg")
let WeatherSymbols = {}
for (const path in WeatherSymbolsFolder) {
  WeatherSymbolsFolder[path]().then((mod) => {
    WeatherSymbols[path.split("/").at(-1)] = mod.default
  })
}


export function WalkPage() {
  const { slug } = useParams();
  const walkData = useWalks(slug);

  document.title = (walkData?.title ?? "A Lake District Walk") + " | wainroutes";


  if (walkData) return <Walk walkData={walkData} slug={slug} />
  else return (
    <>not a valid walk</>
  )
  
}


function Walk({ walkData, slug }) {

  function scrollToSection(section) {
    if (section == "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    else {
      document.getElementById("walk_"+section.toLowerCase()).scrollIntoView({ behavior: "smooth" });
    }

    setCurrentSection(section)
  }

  const [currentSection, setCurrentSection] = useState("overview")
  const sections = ["overview", "route", "waypoints", "gallery", "weather"]

  const [showOverlay, setShowOverlay] = useState(false)
  addEventListener("scroll", (e) => {
    if (e.target.scrollingElement.scrollTop < 120) setShowOverlay(false)
    else setShowOverlay(true)
  });


  return (
    <>
    <main className="walk-page">

      <div className={"walk-page_overlay" + (showOverlay ? " show" : "")}>
        <section>
          <div className="walk-page_overlay-wrapper flex-row flex-apart">
            <div className="walk-page_overlay-title flex-1">
              <button className="subheading" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{walkData?.title}</button>
            </div>

            <div className="walk-page_overlay-nav flex-row">
              {sections.map((sec, index) => {
                return (
                  <button key={index} 
                    onClick={() => scrollToSection(sec)}
                    className={currentSection == sec ? "active" : ""}
                  >
                    {sec.charAt(0).toUpperCase() + sec.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="walk-page_heading">
          {/* <p>walks / ambleside</p> */}
          <h1 className="title">{walkData?.title}</h1>
        </div>

        <div className="walk-page_body grid-two">
          <div className="walk-page_main flex-column flex-1">
            <Summary 
              wainwrights={walkData?.wainwrights}
              length={walkData?.length}
              elevation={walkData?.elevation}
              intro={walkData?.intro}
            />

            <Route
              wainwrights={walkData?.wainwrights}
              center={[walkData?.startLocation?.latitude, walkData?.startLocation?.longitude]}
              slug={slug}
            />

            <Waypoints
              waypoints={walkData?.waypoints}
            />

            <Gallery />

            <Weather />
          </div>

          <div className="walk-page_aside flex-column">
            <div>
              <img src="/images/wainroutes-27012311.JPEG" />
            </div>

            <StartingLocation
              startLocation={walkData?.startLocation}
              busRoutes={walkData?.busConnections}
            />
            <EstimatedTime />
            <Terrain />
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


function Summary({ wainwrights, length, elevation, intro }) {

  const hillData = useHills(null);

  return (
    <div className="walk-page_summary">
      <h2 className="subheading" id="walk_overview" style={{visibility: "hidden", height: 0, padding: 0}}>Overview</h2>
      <div className="walks-page_section flex-column">
        <div>
          <h3 className="smallheading">Wainwrights: </h3>
          <p className="walk-page_wainwrights">
            {wainwrights?.map((hill, index) => {
              return (
                <Fragment key={index}>
                  <span>
                    <Link to={"/wainwrights/"+hill}>{hillData?.[hill]?.name}</Link>
                    {(index+1 < wainwrights?.length ? "," : "")}
                  </span>
                  {(index+2 === wainwrights?.length ? " and " : " ")}
                </Fragment>
              )
            })}
          </p>
        </div>

        <div className="walk-page_summary flex-row">
          <div>
            <h3 className="smallheading">Distance: </h3>
            <p>{displayDistance(length)}</p>
          </div>
          <div>
            <h3 className="smallheading">Elevation: </h3>
            <p>{displayElevation(elevation)}</p>
          </div>
        </div>

        <div>
          <h3 className="smallheading" style={{display: "block"}}>Overview: </h3>
          <p>{intro}</p>
        </div>
      </div>
    </div>
  )
}

function Route({ wainwrights, center, slug }) {

  const hillMarkers = useHillMarkers(wainwrights);

  const [gpxPoints, setGpxPoints] = useState(null);
  const [elevationData, setElevationData] = useState(null);
  useEffect(() => {
    fetch(`/gpx/${slug}.gpx`)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(doc => {
        let coordinates = []
        let elevations = []

        let dist = 0
        let prevPoint = null

        const nodes = [...doc.getElementsByTagName("trkpt")];
        for (let node of nodes) {
          let point = [parseFloat(node.getAttribute("lon")), parseFloat(node.getAttribute("lat"))]

          if (prevPoint) {
            dist += haversine(point, prevPoint)
          }

          coordinates.push(point)

          let ele = {
            "dist": Number((dist / 1000).toFixed(4)),
            "ele": Number(node.getElementsByTagName("ele")[0]?.textContent)
          }
          if (node.getElementsByTagName("name").length > 0) {
            ele["waypoint"] = node.getElementsByTagName("name")[0]?.textContent
          }
          elevations.push(ele)

          // if (node.getElementsByTagName("name").length > 0) {
          //   console.log(node.getElementsByTagName("name")[0]?.textContent)
          //   elevations.push(elevationGroup)
          //   elevationGroup = []
          // }

          prevPoint = point
        }

        setGpxPoints(coordinates);
        setElevationData(elevations)
      });
  }, [slug]);

  const [hoveredIndex, setHoveredIndex] = useState(null)


  return (
    <div>
      <h2 className="subheading" id="walk_route">Route</h2>
      <div className="walks-page_section flex-column">
        <div className="walk-page_map">
          <LakeMap
            gpxPoints={gpxPoints} mapMarkers={hillMarkers}
            defaultCenter={center} defaultZoom={14} >
              <GeoRoute points={gpxPoints} activeIndex={hoveredIndex} />
          </LakeMap>
        </div>
        <div className="walk-page_elevation">
          <ElevationChart
            data={elevationData}
            setActiveIndex={setHoveredIndex}
            showHillMarkers={false}
          />
        </div>
      </div>
    </div>
  )
}

function Waypoints({ waypoints }) {

  return (
    <div>
      <h2 className="subheading" id="walk_waypoints">Waypoints</h2>
      <div className="walks-page_section flex-column">
        {waypoints
        ? Object.keys(waypoints).map((waypoint, index) => {
            return (
              <div key={index}>
                <h3 className="smallheading">{waypoint}</h3>
                <p>{waypoints?.[waypoint]}</p>
              </div>
            )
          })
        : "N/A"
        }
      </div>
    </div>
  )
}

function Gallery({  }) {

  return (
    <div>
      <h2 className="subheading" id="walk_gallery">Gallery</h2>

      <div className="walks-page_section walks-page_gallery grid-three">
        {["01", "02", "04", "05", "06", "07", "08", "09"].map((image, index) => {
          return <img key={index} src={`/images/wainroutes-270123${image}.JPEG`} />
        })}
      </div>
    </div>
  )
}

function Weather({  }) {

  return (
    <div>
      <h2 className="subheading" id="walk_weather">Weather</h2>

      <div className="walks-page_section walks-page_weather flex-row align-center">
        <p className="walks-page_weather-temperature">7°C</p>
        <div className="walks-page_weather-symbol">
          <img src={WeatherSymbols[`cloudy.svg`]} alt={"cloudy"} title={"cloudy"} />
        </div>
        <p>Cloudy H: 7° L: 3° Sunrise: 06:45 Sunset: 20:12</p>
      </div>
    </div>
  )
}


function StartingLocation({ startLocation, busRoutes }) {

  return (
    <div>
      <h2 className="subheading">Starting Location</h2>
      <div className="walk-page_locations flex-column">

        <div className="flex-row flex-apart">
          <p>Location</p>
          <p className="bold">{startLocation?.location ?? "Unavailable"}</p>
        </div>

        <div className="flex-row flex-apart">
          <p>Postcode</p>
          <p className="bold">
            {startLocation?.postCode
            ? <a href={"https://www.google.com/maps/dir/?api=1&destination="+startLocation?.latitude+","+startLocation?.longitude} target="_blank">{startLocation?.postCode}</a>
            : "Unavailable"
            }
          </p>
        </div>

        <div className="flex-row flex-apart">
          <p>Grid Ref</p>
          <p className="bold">{startLocation?.gridRef ?? "Unavailable"}</p>
        </div>

        {/* <div className="flex-row flex-apart">
          <p>What3Words</p>
          <p className="bold">
            {startLocation?.whatThreeWords
            ? <a href={"https://what3words.com/"+startLocation?.whatThreeWords} target="_blank">{"///"+startLocation?.whatThreeWords}</a>
            : "Unavailable"
            }
          </p>
        </div> */}

        <div className="flex-row flex-apart">
          <p>Busses</p>
          <div className="walk-page_busses flex-row">
            {(busRoutes && Object.keys(busRoutes).length > 0)
            ? Object.keys(busRoutes).map((bus, index) => {
                return (
                  <div key={index}
                    className="walk-page_bus-number"
                    style={{"backgroundColor": `var(--clr-bus-${bus})`}}
                  >
                    {bus}
                  </div>
                )
              })
            : "None"
            }
          </div>
        </div>

      </div>
    </div>
  )
}

function EstimatedTime({  }) {

  return (
    <div>
      <h2 className="subheading">Estimated Time</h2>
      <p>At a pace of 3km/h, this walk will take 4.5 hours</p>
    </div>
  )
}

function Terrain({  }) {

  return (
    <div>
      <h2 className="subheading">Terrain</h2>
      <p>This walk involves some small sections of scrambling. (maybe use cool symbols?)</p>
    </div>
  )
}


function NearbyWalks({ location, currentSlug }) {

  const closestWalks = useMemo(() => {
    let walks = useWalks()

    for (let walkSlug of Object.keys(walks)) {
      if (walkSlug === currentSlug) {
        walks[walkSlug].distanceFromLocation = Infinity
        continue
      }

      walks[walkSlug].distanceFromLocation = haversine(location, [walks[walkSlug].startLocation?.longitude, walks[walkSlug].startLocation?.latitude])
    }

    const orderedWalks = Object.values(walks).sort((a, b) => a.distanceFromLocation - b.distanceFromLocation)
    return orderedWalks.slice(0, 3)
  }, [location])


  return (
    <section>
      <div className="walk-page_nearby flex-column align-center">
        <h2 className="heading">Nearby Walks</h2>

        <div className="grid-three">
          {closestWalks.map((walk, index) => {
            return (
              <WalkCard key={index}
                walk={walk} // link={false}
                dist={walk?.distanceFromLocation}
              />
            )
          })}
        </div>

        <Link to="/walks" className="walk-page_nearby-link">view all walks</Link>
      </div>
    </section>
  )
}
