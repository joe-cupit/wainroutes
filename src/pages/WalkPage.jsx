import "./WalkPage.css";

import { useState, useEffect, Fragment, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { NotFoundPage } from "./error/NotFoundPage";

import { useHills } from "../hooks/useHills";
import { useWalks } from "../hooks/useWalks";

import { LakeMap, GeoRoute } from "../components/map";
import { useHillMarkers } from "../hooks/useMarkers";
import ElevationChart from "../components/ElevationChart";
import haversine from "../utils/haversine";
import WalkCard from "../components/WalkCard";
import { displayDistance, displayElevation, displayTemperature, getDistanceValue, getElevationValue } from "../utils/unitConversions";
import useWeather from "../hooks/useWeather";
import { LocationIcon } from "../components/Icons";


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

    setCurrentSection(section)
  }

  const [currentSection, setCurrentSection] = useState("overview")
  const sections = ["overview", "route", "waypoints", "gallery", "weather"]

  const [showOverlay, setShowOverlay] = useState(false)

  function toggleOverlay(e) {
    if (e.target.scrollingElement.scrollTop < 330) setShowOverlay(false)
    else setShowOverlay(true)
  }

  useEffect(() => {
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
        <div className="walk-page_top">
          <Link to="/walks" className="walk-page_top-link"><LocationIcon /> {walkData?.startLocation?.location}</Link>
          <img src={`/images/${walkData?.slug}.jpg`} />
          <div className="walk-page_top-block"></div>
        </div>
      </section>

      <section>
        <div className="walk-page_heading">
          <h1 className="title">{walkData?.title}</h1>
        </div>

        <div className="walk-page_body grid-two">
          <div className="walk-page_aside flex-column">
            <div className="walk-page_aside-tabs flex-row gap-0">
              <button
                className={"walk-page_aside-tab" + (asideTabIndex === 1 ? " selected" : "")}
                onClick={() => toggleAsideTab(1)}
              >
                Location
              </button>
              <button 
                className={"walk-page_aside-tab" + (asideTabIndex === 2 ? " selected" : "")}
                onClick={() => toggleAsideTab(2)}
              >
                Time
              </button>
              <button 
                className={"walk-page_aside-tab" + (asideTabIndex === 3 ? " selected" : "")}
                onClick={() => toggleAsideTab(3)}
              >
                Terrain
              </button>
            </div>

            <div className="walk-page_aside-image">
              <img src={`/images/${walkData?.slug}.jpg`} />
            </div>

            <div className={"walk-page_aside-content" + ([1, 2, 3].includes(asideTabIndex) ? " visible" : "")}>
              <StartingLocation selected={asideTabIndex === 1}
                startLocation={walkData?.startLocation}
                busRoutes={walkData?.busConnections}
              />
              <EstimatedTime selected={asideTabIndex === 2}
                walkLengthInKm={walkData?.length}
              />
              <Terrain selected={asideTabIndex === 3} />
            </div>
          </div>

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

            <Gallery baseId={walkData?.photos?.baseId} />

            <Weather />
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
            "dist": getDistanceValue((dist / 1000)),
            "ele": getElevationValue(node.getElementsByTagName("ele")[0]?.textContent)
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

function Gallery({ baseId }) {

  return (
    <div>
      <h2 className="subheading" id="walk_gallery">Gallery</h2>

      <div className="walks-page_section walks-page_gallery grid-three">
        {["01", "02", "04", "05", "06", "07"].map((image, index) => {
          return <img key={index} src={`/images/wainroutes-${baseId}${image}.jpeg`} />
        })}
      </div>
    </div>
  )
}

function Weather({  }) {

  const weatherData = useWeather()?.days?.[0]?.date ? useWeather()?.days?.[0] : useWeather()?.days?.[1]
  const weatherForecast = weatherData?.forecast
  const suntime = [weatherData?.sunrise, weatherData?.sunset]

  const middayIndex = weatherForecast?.time?.indexOf("12:00")

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const startDate = weatherData?.date ? (new Date(weatherData?.date)) : null
  let comingDays = []
  if (startDate) {
    comingDays = [...Array(7).fill().map((d, n) => (addDays(startDate, n)))]
  }
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)


  return (
    <div>
      <h2 className="subheading" id="walk_weather">Weather</h2>

      <div className="walk-page_weather-tabs flex-row justify-apart">
        {comingDays?.map((day, index) => {
          return (
            <button key={index}
              className={"walk-page_weather-tab flex-column gap-0 align-center smallheading" + (index === selectedDayIndex ? " selected" : "")}
              onClick={() => setSelectedDayIndex(index)}
            >
              <span className="subtext">{days[day.getDay()]}</span>
              <span className="subtext weather-day">{day.getDate()}</span>
            </button>
          )
        })}
      </div>

      <div className="walks-page_section walks-page_weather-main flex-column gap-0">
        <h3 className="subheading walks-page_weather-date">{comingDays[selectedDayIndex].toDateString()}</h3>
        <p className="subtext walks-page_weather-suntime">Sunrise: {suntime[0]} Sunset: {suntime[1]}</p>
        <div className="flex-row align-center gap-0">
          <p className="walks-page_weather-temperature">{displayTemperature(Number(weatherForecast?.temp[middayIndex]))}</p>
          <div className="walks-page_weather-symbol">
            <img src={WeatherSymbols[`${weatherForecast?.type[middayIndex]?.toLowerCase().replaceAll(" ", "-").replaceAll(/[()]/g, "")}.svg`]} alt={weatherForecast?.type[middayIndex]} title={weatherForecast?.type[middayIndex]} />
          </div>
          <p>{weatherForecast?.type[middayIndex]} H: {displayTemperature(Math.max(...weatherForecast?.temp ?? "none"), false)} L: {displayTemperature(Math.min(...weatherForecast?.temp ?? "none"), false)}</p>
        </div>
      </div>
    </div>
  )
}


function StartingLocation({ selected, startLocation, busRoutes }) {

  return (
    <div className={"walk-page_aside-section" + (selected ? " selected" : "")}>
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

function EstimatedTime({ selected, walkLengthInKm }) {

  const [speedInKm, setSpeedInKm] = useState(2.5)

  const timeTaken = useMemo(() => {
    let time = walkLengthInKm / speedInKm

    if (time < 1) return (time * 60).toFixed(0) + " mins"
    else return time.toFixed(1) + " hours"
  }, [walkLengthInKm, speedInKm])


  return (
    <div className={"walk-page_estimated-time walk-page_aside-section" + (selected ? " selected" : "")}>
      <h2 className="subheading">Estimated Time</h2>
      <p>An average pace of {displayDistance(speedInKm, 1) + "/h"} completes this walk in {timeTaken}</p>
      <input type="range" min={1} max={6} step={0.1} value={speedInKm} onChange={e => setSpeedInKm(e.target.value)} />
      {/* <p className="subtext">*always allow ample time to complete walks in the mountains</p> */}
      <p className="subtext">*hiking pace in the mountains is always slower than on flat ground</p>
    </div>
  )
}

function Terrain({ selected }) {

  return (
    <div className={"walk-page_terrain walk-page_aside-section" + (selected ? " selected" : "")}>
      <h2 className="subheading">Terrain</h2>
      <div className="walk-page_terrain-badges flex-row">
        <svg width="64" height="64" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1_4)">
          <circle cx="64" cy="64" r="62" fill="#57B493"/>
          <path d="M52.7463 100L52.209 106L60.2687 104.909L60.806 102.182L61.3433 97.8182L61.8806 94L62.4179 90.7273L62.9552 86.9091L63.4925 81.4545V73.2727L65.6418 75.4545L67.2537 78.1818L69.9403 80.3636L70.4776 83.5L69.9403 88L69.403 93.4545L67.791 97.8182L67.2537 101.636L69.403 103.818L75.8507 102.727V100L76.3881 95.0909L76.9254 89.6364L78 80.9091V78.7273L77.4627 76.5455L76.3881 75.4545L73.1642 71.0909L70.4776 67.8182L68.8657 64V62.3636L69.9403 60.7273L71.0149 58.5455L71.5522 53.6364V43.8182L71.0149 35.0909L70.4776 32.9091L68.3284 30.1818L68.8657 29.6364L69.9403 29.0909L71.0149 27.4545L71.5522 26.3636L72.0896 24.7273L72.6269 21.4545L71.0149 18.7273L68.3284 16L63.4925 16.5455L61.3433 19.8182L60.806 24.7273H59.7313L59 24L57.5 23.5L56.5 24V25.5L56 27V27.5L54.5 28L52.7463 30.1818L52.1698 32.3636H50.597L47.3731 34.5455L44.6866 38.3636L43.0746 41.6364L42 45.4545V50.9091L43.0746 56.9091L45.2239 57.4545L48.9851 56.9091L50.597 57.4545L51.6716 63.4545L52.7463 65.6364L53.2836 70L53.8209 75.4545L54.3582 85.2727V89.0909L53.2836 92.9091L52.7463 100Z" fill="var(--clr-black-400)"/>
          <path d="M42.5 101.5L35.5 100.5L30.5 103L24 104L30.5 114.5L48 121.5L63.5381 124.7L79.8206 121L95 115L107.5 106L114.5 95L119 85L112.5 86.5L107.5 90L101.5 91L95 90.5L91 91L85 95L78 97L71 96H63L59.5 97.5L50.5 98.5L47 100.5L42.5 101.5Z" fill="var(--clr-black-400)"/>
          <circle cx="64" cy="64" r="60" stroke="var(--clr-black-400)" stroke-width="8"/>
          </g>
          <defs>
          <clipPath id="clip0_1_4">
          <rect width="128" height="128" fill="white"/>
          </clipPath>
          </defs>
        </svg>
        <svg width="64" height="64" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1_38)">
          <circle cx="64" cy="64" r="62" fill="#C49E4C"/>
          <path d="M59 71H57.5L53 75L49 84L44.5 96L39 103.5L35 115L37 119L45.5 121.5L57.5 123.5L77.5 124L89.5 119L92 116L93.5 109.5L88 99L81.5 87.5L73.5 73L71 70.5H70.5L64 71L61 70.5L59 71Z" fill="var(--clr-black-200)"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M43.5 121L46 119L53.5 112.5L57 109.5L59.5 105.5L58 102L50.5 100.5L48.5 97L49.5 93L54 89L61 88.5333V89L64.5 90L72 88.5L76.5 90L78 89.5L79.5 94L80 97V98.5L77.5 107L83 107.5L85 112.5L88 116H90.5H96L105 111.5L114.5 100L120.5 81L122.5 70.5L119 69.5L117 70.5L112.5 69.5L100.5 68L97 69.5H89L82.5 69L76 69.5L72.5 70H71L70.5 70.5V71.5L66.5 72L63.5 74.5L68.5 77H71.5L67.5 79L64.5 81L62.5 85.5L61 86.5V87.7778L57.5 85.5L57 82L55.5 78.5L59.5 76H61.5L61 73.5L61.5 71.5L59 71H58L57.5 70.5L53.5 70H46.5L35 70.5L30.5 72L23.5 71.5L15 71L10.5 69.5L6 71L3 72L7 90L16.5 102.5L28.5 113.5L35 118L43.5 121Z" fill="var(--clr-black-400)"/>
          <path d="M63 104L64 101L68.5 98L72.5 100L75.5 99L76.5 100.5L76 104.5L74 107.5L71 108L67.5 110L64.5 112L62 116L60.5 114.5L61 110L62.5 108L63 104Z" fill="var(--clr-black-400)"/>
          <path d="M68 122L69.5 119L71.5 118.5H75L77.5 117L78.5 114L80.5 113L82 115L84.5 116L86 118L68 122Z" fill="var(--clr-black-400)"/>
          <circle cx="64" cy="64" r="60" stroke="var(--clr-black-400)" stroke-width="8"/>
          </g>
          <defs>
          <clipPath id="clip0_1_38">
          <rect width="128" height="128" fill="white"/>
          </clipPath>
          </defs>
        </svg>
        <svg width="64" height="64" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1_44)">
          <circle cx="64" cy="64" r="62" fill="#B65353"/>
          <path d="M24.5 108.5L22.5591 109.385L28 114.5L42.4095 119.57L59.6063 122L87.8582 117.748L100.5 110.919L106 104.419L101.5 98.5333L97.5 91.5L92.5 87L87.8582 75.5L83 65L81.5 58L77.5 51.5L71.2992 45.5L67.5906 41.8222L64.5197 40H62.6772L58.378 44.2519L55.9213 48.5037L51.5 54.5L47.5 61L45 73L40 79L36.5 89.5L31.5 96.1148L27.5 104.419L24.5 108.5Z" fill="var(--clr-black-400)"/>
          <path d="M56.2992 114.5L53.2992 120.5L60.2992 124H70.7992L77.7992 119.5L76.2992 104V97.5L75.2992 89L73.2992 82.5L69.7992 75L67.7992 62L67.2992 58L66.2992 51L66.7992 46L67.7992 42L64.7992 40H62.2992L61.2992 41.5L61.7992 44L60.7992 49L59.7992 55.5L60.2992 63.5V74L59.2992 84L57.7992 95L58.7992 109.5L56.2992 114.5Z" fill="var(--clr-black-200)"/>
          <circle cx="64" cy="64" r="60" stroke="var(--clr-black-400)" stroke-width="8"/>
          </g>
          <defs>
          <clipPath id="clip0_1_44">
          <rect width="128" height="128" fill="white"/>
          </clipPath>
          </defs>
        </svg>
      </div>
      <p>This walk involves some small sections of scrambling.</p>
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

        <div className="walk-page_nearby-walks">
          {closestWalks.map((walk, index) => {
            return (
              <WalkCard key={index}
                walk={walk} // link={false}
                distFrom={location}
              />
            )
          })}
        </div>

        <Link to="/walks" className="walk-page_nearby-link">view all walks</Link>
      </div>
    </section>
  )
}
