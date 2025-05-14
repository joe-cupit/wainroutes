import "./HomePage.css";

import { useMemo } from "react";
import { Link } from "react-router-dom";

import Image from "../components/Image";
import { Walk } from "./WalkPage/WalkPage";
import WalkCard from "../components/WalkCard";
import { LakeMap } from "../components/map";

import { useWalks } from "../hooks/useWalks";
import setPageTitle from "../hooks/setPageTitle";


export function HomePage() {

  setPageTitle("");

  const walks = useMemo(() => useWalks() as { [slug: string] : Walk }, [])
  const featuredWalks = useMemo(() => ["helvellyn-via-striding-edge", "a-coledale-horseshoe", "the-old-man-of-coniston"], [])


  return (
    <main className="home-page">
      <section className="home__hero-section">
        <div className="home__hero">
          <h1 className="title">Step Into Walks All Over The Lake District</h1>
          <input type="text"
            className="home__hero-search"
            placeholder="Search for a walk"
          />
          <Link to="/walks" className="button underlined">View all walks</Link>
        </div>

        <Image
          className="home__hero-image"
          name="home_01"
        />
      </section>

      <section>
        <div className="home__featured">
          <div className="home__featured-title">
            <h2 className="heading">Start Walking The Wainwrights</h2>
            <p>Check out today's featured routes:</p>
          </div>

          <div className="home__featured-walks">
            {featuredWalks.map((walk, index) => {
              return <WalkCard key={index} walk={walks[walk]} />
            })}
          </div>

          <Link to="/walks" className="button">View all walks</Link>
        </div>
      </section>

      <section className="home__wainwrights-section">
        <div className="home__wainwrights">
          <div className="home__wainwrights-text">
            <h2 className="heading">The 214 Wainwrights</h2>

            <p></p>
            <p></p>
            <p></p>
            <Link to="/wainwrights" className="button">Learn more about A. Wainwright &nbsp; ➤</Link>
          </div>

          <div className="home__wainwrights-map">
            <LakeMap />
          </div>
        </div>
      </section>

      <div style={{height: "10rem"}}></div>
    </main>
  )
}
