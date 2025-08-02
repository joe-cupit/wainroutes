"use client";

import styles from "../Walk.module.css";
import fontStyles from "@/app/fonts.module.css";
import buttonStyles from "@/app/buttons.module.css";

import { BackIcon, ElevationIcon, HikingIcon, MountainIcon } from "@/icons/WalkIcons";
import { useEffect, useState } from "react";


export default function Overlay({ walkData } : { walkData: {title: string, wainwrightCount: number, lengthString: string, elevationString: string}}) {
  // function scrollToSection(section: string) {
  //   if (section == "overview") {
  //     window.scrollTo({ top: 0, behavior: "smooth" })
  //   }
  //   else {
  //     document.getElementById("walk_"+section.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }

  const [showOverlay, setShowOverlay] = useState(false);
  // const [currentSection, setCurrentSection] = useState("overview");

  // const titleRef = useRef<HTMLHeadingElement>(null);
  // const overviewRef = useRef<HTMLDivElement>(null);
  // const routeRef = useRef<HTMLDivElement>(null);
  // const waypointsRef = useRef<HTMLDivElement>(null);
  // const photosRef = useRef<HTMLDivElement>(null);
  // const weatherRef = useRef<HTMLDivElement>(null);
  // const sections = [
  //   {section: "overview", ref: overviewRef},
  //   {section: "route", ref: routeRef},
  //   {section: "waypoints", ref: waypointsRef},
  //   {section: "photos", ref: photosRef},
  //   {section: "weather", ref: weatherRef}
  // ]

  const sections = ["overview", "route", "waypoints", "photos", "weather"];

  useEffect(() => {

    function toggleOverlay() {
      const currentScroll = document.scrollingElement?.scrollTop ?? 0;

      if (currentScroll < 400) {
        setShowOverlay(false)
        // setCurrentSection("overview")
      }
      else {
        setShowOverlay(true)

        // const selected = sections.find(({ ref }) => {
        //   const ele = ref.current
        //   if (ele) {
        //     return currentScroll + 60 < (ele.offsetTop + ele.getBoundingClientRect().height)
        //   }
        // })

        // if (selected) {
        //   setCurrentSection(selected.section)
        // }
        // else {
        //   setCurrentSection("")
        // }
      }
    }


    window.addEventListener("scroll", toggleOverlay)

    return () => {
      window.removeEventListener("scroll", toggleOverlay)
    }
  }, [])

  return (
    <div>
      <div className={`${styles.overlay} ${showOverlay ? styles.show : ""}`}>
        <section>
          <div className={styles.overlayWrapper}>
            <div className={styles.overlayLeft}>
              <button className={buttonStyles.iconButton} title="Back to walks" aria-label="Back to walks" onClick={() => history.back()}><BackIcon /></button>
              <div className={styles.overlayTitle}>
                <button className={fontStyles.subheading} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{walkData.title}</button>
                <div className={styles.overlayDetails}>
                  <span><MountainIcon /> {walkData.wainwrightCount}</span>
                  <span><HikingIcon /> {walkData.lengthString}</span>
                  <span><ElevationIcon /> {walkData.elevationString}</span>
                </div>
              </div>
            </div>
            <div className={styles.overlayNav}>
              {sections.map((sec, index) => (
                <button key={index}
                  // onClick={() => scrollToSection(sec)}
                  // className={(currentSection == sec ? "active" : "")}
                >
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
