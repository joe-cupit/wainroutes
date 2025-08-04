"use client";

import styles from "../Walk.module.css";
import fontStyles from "@/app/fonts.module.css";
import buttonStyles from "@/app/buttons.module.css";

import { Fragment, useEffect, useState } from "react";

import { BackIcon, ElevationIcon, HikingIcon, MountainIcon } from "@/icons/WalkIcons";


export default function Overlay({ walkData } : { walkData: {title: string, wainwrightCount: number, lengthString: string, elevationString: string}}) {
  function scrollToSection(section: HTMLElement | null) {
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth" });
  }

  const [showOverlay, setShowOverlay] = useState(false);
  const [sections, setSections] = useState<{name: string; ref: HTMLElement | null}[]>();
  const [currentSection, setCurrentSection] = useState("overview");

  useEffect(() => {
    const overviewRef = document.getElementById("walk-summary");
    const routeRef = document.getElementById("walk-route");
    const waypointsRef = document.getElementById("walk-waypoints");
    const photosRef = document.getElementById("walk-photos");
    const weatherRef = document.getElementById("walk-weather");
    const nearbyRef = document.getElementById("nearby-walks");

    const sections = [
      {name: "overview", ref: overviewRef},
      {name: "route", ref: routeRef},
      {name: "waypoints", ref: waypointsRef},
      {name: "photos", ref: photosRef},
      {name: "weather", ref: weatherRef},
      {name: "nearby", ref: nearbyRef}
    ]
    setSections(sections);
  }, [])


  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const overlay = document.getElementById("walk-overlay");

    function toggleOverlay() {
      const currentScroll = document.scrollingElement?.scrollTop ?? 0;

      if (currentScroll < (sections?.[0].ref?.offsetTop ?? 400) - 50) {
        setShowOverlay(false);
        setCurrentSection("overview");
      }
      else {
        setShowOverlay(true);

        if (window.innerWidth < 552 && navbar && overlay) {
          if (navbar?.classList.contains("sticky")) {
            overlay?.classList.remove(styles.stickyTop);
          }
          else overlay?.classList.add(styles.stickyTop);
        }

        if (sections) {
          const selected = sections.find(({ ref }) => {
            if (ref) {
              return currentScroll + 200 < (ref.offsetTop + ref.getBoundingClientRect().height);
            }
          })

          if (selected) setCurrentSection(selected.name);
          else setCurrentSection("");
        }
      }
    }

    toggleOverlay();
    window.addEventListener("scroll", toggleOverlay)
    return () => {
      window.removeEventListener("scroll", toggleOverlay)
    }
  }, [sections])

  return (
    <div id="walk-overlay" className={`${styles.overlay} ${showOverlay ? styles.show : ""}`}>
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
            {sections && Object.values(sections).map((sec, index) => 
              sec.ref
              ? <button key={index}
                  onClick={() => scrollToSection(sec.ref)}
                  className={(currentSection == sec.name) ? styles.active : ""}
                >
                  {sec.name.charAt(0).toUpperCase() + sec.name.slice(1)}
                </button>
              : <Fragment key={index}></Fragment>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
