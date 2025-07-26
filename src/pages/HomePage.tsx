import "./HomePage.css";

import { useState } from "react";
import { Link } from "react-router-dom";
import WainroutesHelmet from "../components/WainroutesHelmet";

import { Picture } from "../components/Image";
import WalkCard from "../components/WalkCard";
import { LakeMap } from "../components/map";

import { useWalk } from "../contexts/WalksContext";
import { useHillMarkers } from "../hooks/useMarkers";
import WalkSearch from "../components/WalkSearch";


const featuredWalkSlugs = ["helvellyn-via-striding-edge", "wansfell-baystones", "the-kentmere-horseshoe"];


export function HomePage() {

  const featuredWalks = featuredWalkSlugs.map(slug => useWalk(slug).walkData);

  const hillMarkers = useHillMarkers();


  return (
    <main className="home-page">
      <WainroutesHelmet
        description="Lake District walks across the 214 Wainwrights."
        canonical=""
      />

      <section className="home__hero-section">
        <div className="home__hero">
          <h1 className="title">Your Guide to Walking The Wainwrights</h1>
          <WalkSearch className="home__hero-search" />
          <Link to="/walks" className="button underlined">View all walks</Link>
        </div>

        <div className="home__hero-image-overlay" />
        <Picture
          className="home__hero-image"
          names={["home_01", "home_02"]}
          widths={[700]}
          sizes="200vw"
        />
      </section>

      <section>
        <div className="home__featured">
          <div className="home__featured-title">
            <h2 className="heading">Featured Routes</h2>
          </div>

          <div className="walks-card__group">
            {!featuredWalks.some(v => v === undefined) &&
              featuredWalks.map((walk, index) => {
                return walk && <WalkCard key={index} walk={walk} />
              })
            }
          </div>

          <Link to="/walks" className="button primary">View more walks</Link>
        </div>
      </section>

      <section className="home__wainwrights-section">
        <div className="home__wainwrights">
          <div>
            <h2 className="heading">The 214 Wainwrights</h2>

            <div className="home__wainwrights-text">
              <p>
                The Wainwrights are 214 fells in the Lake District collected by A. Wainwright in his seven-volume <i>Pictorial Guide to the Lakeland Fells</i>. Each book covers a different region, with hand-drawn maps, route details, and notes on the landscape.
              </p>
              <p>
                Since the first volume was published in 1955, Wainwright's writing has inspired many to get out and explore the Lakes, with plenty of walkers aiming to summit the full set.
              </p>
              <p>
                Here you'll find a collection of routes I've used so far on my own journey to complete the Wainwrights. Whether you're aiming for all 214 or just looking for your next day out in the fells, I hope these walks help you enjoy the Lakes.
              </p>
            </div>
            <Link to="/wainwrights" className="button">Learn more about The Wainwrights</Link>
          </div>

          <div className="home__wainwrights-map">
            <LakeMap mapMarkers={hillMarkers} />
          </div>
        </div>
      </section>

      {/* <section>
        <div className="home__faq">
          <h2 className="heading">FAQ</h2>

          <div className="faq">
            <FaqQuestion
              question="Are there dog friendly walks?"
              answer="Yes, many walks in the Lake District are suitable for fit dogs. As an owner, you have to be aware of the many Herdwick sheep that roam freely on the mountains and steep terrain."
            />
            <FaqQuestion
              question="Are the walks suitable for beginners?"
              answer="Yes, many walks provide an easier climb. The Wainwrights range in both height and steepness, so there a fell for everyone. Each route shows what might make it hard."
            />
            <FaqQuestion
              question="What is a GPX file?"
              answer="A GPX file contains the route, waypoint, and elevation data for a walk. Each walk's GPX file can be downloaded and uploaded to route tracking apps like Strava, OS Maps and AllTrails so you can follow it."
            />
          </div>
        </div>
      </section> */}

      <div style={{height: "5rem"}}></div>
    </main>
  )
}


function FaqQuestion({ question, answer } : { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="faq-block"
      data-open={open}
    >
      <h3
        className="faq__question"
        onClick={() => setOpen(prev => !prev)}
      >
        {question}
      </h3>

      <p className="faq__answer">{answer}</p>
    </div>
  )
}
