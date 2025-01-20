import "./WalkPage.css";

import { useState, useEffect, Fragment, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";

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
import { BackIcon, ElevationIcon, HikingIcon, LocationIcon, MountainIcon, TerrainExposureIcon, TerrainGradientIcon, TerrainPathIcon } from "../components/Icons";
import ImageGallery from "../components/ImageGallery";


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
            return currentScroll + 40 < (ele.offsetTop + ele.getBoundingClientRect().height)
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
              <Link to="/walks" title="Back"><BackIcon /></Link>
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
        <div className="walk-page_top">
          <Link to="/walks" className="walk-page_top-link"><LocationIcon /> {walkData?.startLocation?.location}</Link>
          <img src={`/images/${walkData?.slug}.jpg`} />
          <div className="walk-page_top-block"></div>
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
              baseId={walkData?.photos?.baseId}
            />

            <Weather secRef={weatherRef} />
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


function Summary({ secRef, wainwrights, length, elevation, intro }) {

  const hillData = useHills(null);

  return (
    <div className="walk-page_summary" ref={secRef}>
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

function Route({ secRef, wainwrights, center, slug }) {

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
    <div ref={secRef}>
      <div className="walk-page_route-title flex-row flex-apart">
        <h2 className="subheading" id="walk_route">Route</h2>
        <button className="primary small bottom-left button">
          Download GPX
        </button>
      </div>
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

function Waypoints({ secRef, waypoints }) {

  return (
    <div ref={secRef}>
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

function Photos({ secRef, baseId }) {

  return (
    <div ref={secRef}>
      <h2 className="subheading" id="walk_photos">Photos</h2>

      <ImageGallery imageList={["01", "02", "03", "04", "05", "06", "07"].map(img => baseId+img)} />
    </div>
  )
}

function Weather({ secRef }) {

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
    <div ref={secRef}>
      <h2 className="subheading" id="walk_weather">Weather</h2>

      <div className="walk-page_weather-tabs flex-row justify-apart">
        {comingDays?.map((day, index) => {
          return (
            <button key={index}
              className={"walk-page_weather-tab flex-column gap-0 align-center smallheading" + ([0, 6].includes(day.getDay()) ? " weekend" : "") + (index === selectedDayIndex ? " selected" : "")}
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

  const [speedInKm, setSpeedInKm] = useState(3)

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

function Terrain({ selected, walkTerrain }) {

  return (
    <div className={"walk-page_terrain walk-page_aside-section" + (selected ? " selected" : "")}>
      <h2 className="subheading">Terrain</h2>
      {walkTerrain
      ? <div className="flex-column">
          <div className="walk-page_terrain-badges flex-row">
            {walkTerrain?.gradient && <TerrainGradientIcon level={walkTerrain?.gradient} />}
            {walkTerrain?.path && <TerrainPathIcon level={walkTerrain?.path} />}
            {walkTerrain?.exposure && <TerrainExposureIcon level={walkTerrain?.exposure} />}
          </div>
          <p>{walkTerrain?.desc?.length > 0 ? walkTerrain?.desc : "No details"}</p>

          <p className="subtext">*terrain badges are merely a suggestion, always properly prepare for changing weather conditions</p>
        </div>
      : <p>No information available</p>}
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
    <section className="walk-page_nearby">
      <div className="flex-column align-center">
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

        <Link to="/walks" className="primary button">View all walks</Link>
      </div>
    </section>
  )
}
