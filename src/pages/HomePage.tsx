import "./HomePage.css";

import { Link } from "react-router-dom";

import Image from "../components/Image";
import { Walk } from "./WalkPage/WalkPage";
import WalkCard from "../components/WalkCard";

import { useWalks } from "../hooks/useWalks";
import { LakeMap } from "../components/map";


export function HomePage() {

  const walks = useWalks() as { [slug: string] : Walk };


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
            <WalkCard walk={walks["the-kentmere-horseshoe"]} />
            <WalkCard walk={walks["a-coledale-horseshoe"]} />
            <WalkCard walk={walks["the-old-man-of-coniston"]} />
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
