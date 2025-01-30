import "./WalksPage.css";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useWalks } from "../hooks/useWalks";

import { LakeMap } from "../components/map";

import { useWalkMarkers } from "../hooks/useMarkers";
import { ChevronIcon  } from "../components/Icons";
import WalkCard from "../components/WalkCard"
import haversine from "../utils/haversine";
import { displayDistance } from "../utils/unitConversions";


export function WalksPage() {

  document.title = "Discover Lake District Walks – Wainroutes";

  const walkMarkers = useWalkMarkers(null);
  const [walkData, setWalkData] = useState(Object.values(useWalks(null)));
  const [sortValue, setSortValue] = useState("recommended");
  const [nearLocation, setNearLocation] = useState(null)

  useEffect(() => {
    let newWalkData = [...walkData]
    if (nearLocation !== null) {
      for (let walk of newWalkData) {
        walk.distance = haversine([walk.startLocation?.longitude, walk.startLocation?.latitude], nearLocation?.coords) / 1000
      }
    }

    setWalkData(newWalkData)
  }, [nearLocation])

  const sortedWalkData = useMemo(() => {
    let filteredWalkData = [...walkData]
    if (nearLocation) {
      filteredWalkData = filteredWalkData.filter(a => a.distance < 10)
    }

    if (sortValue === null || sortValue === "recommended") return filteredWalkData;

    let newWalkData = [...filteredWalkData];
    const [type, dir] = sortValue.split("-");
    switch (type) {
      case "closest":
        newWalkData.sort((a, b) => a.distance - b.distance)
        break;
      case "recent":
        newWalkData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "hills":
        newWalkData.sort((a, b) => a.wainwrights?.length - b.wainwrights?.length);
        break;
      case "ele":
        newWalkData.sort((a, b) => a.elevation - b.elevation);
        break;
      case "dist":
        newWalkData.sort((a, b) => a.length - b.length);
        break;
      default:
        break;
    }

    if (dir === "dsc") {
      newWalkData.reverse();
    }

    return newWalkData;
  }, [walkData, sortValue]);

  const [hovered, setHovered] = useState(null);

  const locations = useMemo(() => ({
    "keswick": {name: "Keswick", coords: [-3.1347, 54.6013]},
    "ambleside": {name: "Ambleside", coords: [-2.9613, 54.4287]},
    "grasmere": {name: "Grasmere", coords: [-3.0244, 54.4597]},
    "buttermere": {name: "Buttermere", coords: [-3.2766, 54.5413]},
    "borrowdale": {name: "Borrowdale", coords: [-3.1486, 54.5028]},
    "coniston": {name: "Coniston", coords: [-3.0759, 54.3691]},
    "glenridding": {name: "Glenridding", coords: [-2.9498, 54.5448]},
    "windermere": {name: "Windermere", coords: [-2.9068, 54.3807]},

    "dungeon-ghyll": {name: "Dungeon Ghyll", coords: [-3.0942, 54.4461]},
    "kentmere": {name: "Kentmere", coords: [-2.8402, 54.4302]},
    "seatoller": {name: "Seatoller", coords: [-3.1678, 54.5142]},
    "braithwaite": {name: "Braithwaite", coords: [-3.1923, 54.6026]},
    "wasdale": {name: "Wasdale", coords: [-3.2966, 54.4660]},
    "thirlmere": {name: "Thirlmere", coords: [-3.0642, 54.5365]},
    "thornthwaite": {name: "Thornthwaite", coords: [-3.2029, 54.6173]},
    "rosthwaite": {name: "Rosthwaite", coords: [-3.1466, 54.5228]},
    "whinlatter-pass": {name: "Whinlatter Pass", coords: [-3.2256, 54.6082]},
    "threlkeld": {name: "Threlkeld", coords: [-3.0543, 54.6190]},
    "dodd-wood": {name: "Dodd Wood", coords: [-3.1868, 54.6428]},
  }), [])

  const [searchParams, setSearchParams] = useSearchParams()
  
  useEffect(() => {
    if (searchParams.has("nearto")) {
      let nearto = searchParams.get("nearto").toLowerCase()
      if (nearto in locations) {
        setNearLocation(locations[nearto])
      }
      else {
        searchParams.delete("nearto")
        setSearchParams(searchParams)
      }
    }
    else {
      setNearLocation(null)
    }
  }, [searchParams])

  const [openLocationPicker, setOpenLocationPicker] = useState(false)


  return (
    <main className="walks-page">

      <section>
        <div className="flex-column">
          <span className="walks-page_title">
            <h1 className="title">
              {nearLocation
                ? <>Walks near {<button onClick={() => setOpenLocationPicker(prev => !prev)} className="walks-page_place-button" title="Change location">{nearLocation?.name}</button>}</>
                // : <>Walks in the {<button onClick={() => setOpenLocationPicker(prev => !prev)} className="walks-page_place-button" title="Change location">Lake District</button>}</>
                : <>Walks in the Lake District</>
              }
            </h1>

            <LocationSelect
              open={openLocationPicker}
              setOpen={setOpenLocationPicker}
              locations={locations}
              nearLocation={nearLocation}
              setSearchParams={setSearchParams}
            />
          </span>
          <p>Explore the best walks covering the Wainwrights around {nearLocation?.name}.</p>

          <div className="walks-page_body flex-row wrap-none">
            <div className="flex-column gap-0 walks-page-main">
              <div className="walks-page_body-header flex-row align-center">
                <input type="text" placeholder="search for a route, place, or wainwright" className="walk-page_search-bar" />
                <WalkSortSelect allowClosest={nearLocation !== null} setGlobalSortValue={setSortValue} />
              </div>
              <div className="walks-page-list flex-row">
                {(sortedWalkData.length > 0)
                ? sortedWalkData?.map((walk, key) => {
                    return (
                      <WalkCard key={key} walk={walk}
                        distFrom={nearLocation && nearLocation?.coords}
                        onHover={(mouseEnter=false) => {
                          if (mouseEnter) setHovered(walk?.slug)
                          else setHovered(null)
                        }}
                      />
                    )
                  })
                : <div>No walks match these filters.</div>
                }
              </div>
              <p className="subtext" style={{marginInline: "auto", marginBlock: "0.5em 1em"}}>
                {nearLocation ? "• Showing all our Lake District walks within "+displayDistance(10, 0)+" of "+nearLocation?.name+" •" : ""}
              </p>
            </div>
            <div className="walks-page-map">
              <LakeMap mapMarkers={walkMarkers} activePoint={hovered} />
            </div>
          </div>
        </div>        
      </section>

    </main>
  )
}


function LocationSelect({ open, setOpen, locations, nearLocation, setSearchParams }) {

  function changeLocation(label) {
    let newParams = new URLSearchParams()

    if (label === "all") {
      setSearchParams(newParams)
    }
    else {
      newParams.set("nearto", label)
      setSearchParams(newParams)
    }

    setOpen(false)
  }


  return (
    <div
      className="walks-page_place-popup flex-column gap-0"
      style={open ? {} : {display: "none"}}
    >
      {/* <h2 className="heading">Select a location</h2> */}

      {/* <div className="flex-column gap-0"> */}
      <label className={"walks-page_place-popup_option" + (nearLocation === null ? " current" : "")}>
        <input type="radio"
          checked={nearLocation === null}
          onChange={() => changeLocation("all")}
        />
        All walks
      </label>
      {Object.keys(locations)?.map((label, index) => {
        return (
          <label key={index} className={"walks-page_place-popup_option" + (nearLocation?.name === locations[label]?.name ? " current" : "")}>
            <input type="radio"
              checked={nearLocation?.name === locations[label]?.name}
              onChange={() => changeLocation(label)}
            />
            {locations[label]?.name}
          </label>
        )
      })}
      {/* </div> */}
    </div>
  )
}


function WalkSortSelect({ setGlobalSortValue, allowClosest=false }) {

  const options = useMemo(() => ({
    "closest": "Closest",
    "recommended": "Recommended",
    "recent": "Recently Added",
    "hills-dsc": "Most Wainwrights",
    // "hills-asc": "Least Wainwrights",
    "dist-dsc": "Longest Route",
    "dist-asc": "Shortest Route",
    "ele-dsc": "Most Elevation",
    "ele-asc": "Least Elevation",
  }), [])
  const [selected, setSelected] = useState(allowClosest ? "closest" : "recommended")

  function onRadioChange(key) {
    if (selected === key) setSelected(null)
    else setSelected(key)
    setOpen(false)
  }

  useEffect(() => {
    setGlobalSortValue(selected)
  }, [selected])

  useEffect(() => {
    if (allowClosest) setSelected("closest")
    else {
      if (selected === "closest") setSelected("recommended")
    }
  }, [allowClosest])

  const [open, setOpen] = useState(false)


  return (
    <div className={"walks-page_sort" + (open ? " active" : "")}>
      <button
        className="walks-page_sort-button flex-row flex-apart"
        onClick={() => setOpen(prev => !prev)}
      >
        {options[selected]}
        <ChevronIcon />
      </button>

      <div
        className="walks-page_sort-popup flex-column"
        style={open ? {} : {display: "none"}}
      >
        <div className="walks-page_sort-options flex-column wrap-none">
          {options && Object.keys(options).map((label, index) => {
            if (index !== 0 || allowClosest) {
              return (
                <WalkSortSelectOption key={index}
                  label={options[label]}
                  checked={selected == label}
                  setChecked={() => onRadioChange(label)}
                />
              )
            }

          })}
        </div>
      </div>
    </div>
  )
}

function WalkSortSelectOption({ label, checked, setChecked }) {

  return (
    <label className={"walks-page_sort-options_option" + (checked ? " checked" : "")}>
      <input type="radio" checked={checked} onChange={setChecked} />
      {label}
    </label>
  )
}
