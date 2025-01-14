import "./Home.css";

import { Link } from "react-router-dom";
import HerdyImage from "../assets/images/home/herdy.jpeg"
import FlatMap from "../components/FlatMap";
import { useEffect } from "react";


export function HomePage() {

  document.title = "Wainroutes | Lake District Wainwright Walks";


  const MapWidth = 518
  const MapHeight = 614
  const HalfWidth = MapWidth/2
  const HalfHeight = MapHeight/2

  useEffect(() => {

    function throttle(callback, wait) {
      var timeout
      return function(e) {
        if (timeout) return
        timeout = setTimeout(() => (callback(e), timeout=undefined), wait)
      }
    }

    const mapBounds = document.getElementById("flat-map")?.getBoundingClientRect()
    const centerX = mapBounds.x + HalfWidth
    const centerY = mapBounds.y + HalfHeight

    const maxX = mapBounds.x - HalfWidth / 1.75
    const minX = mapBounds.x + MapWidth + HalfWidth / 1.75

    function mouseListener(e) {

      const originX = centerX - (Math.min(minX, Math.max(maxX, e.pageX)) - HalfWidth)
      const originY = centerY - (Math.min(mapBounds.y+MapHeight, Math.max(mapBounds.y, e.pageY)) - HalfHeight)
      const origin = `${originX}px ${originY}px`

      images.forEach((image, index) => {
        if (index === 0) return

        // setTimeout(() => {image.style.transformOrigin = origin}, 1000)
        image.style.transformOrigin = origin

        // image.animate({ 
        //   transformOrigin: origin
        // }, { duration: 750, fill: "forwards", easing: "ease" });
      })
    }

    function mouseLeave() {
      flatMap.querySelectorAll("img").forEach((image, index) => {
        if (index === 0) return

        // image.style.transformOrigin = "66% 66%"
        setTimeout(() => {
          image.style.transformOrigin = "66% 66%"
          // image.animate({ 
          //   transformOrigin: "66% 66%"
          // }, { duration: 250, fill: "forwards", easing: "ease" });
        }, 50)
      })
    }


    const func = throttle(mouseListener, 10)

    const flatMap = document.getElementById("home-hero")
    const images = flatMap.querySelectorAll("img")
    flatMap.addEventListener("mousemove", func)
    // flatMap.addEventListener("mouseleave", mouseLeave)

    return () => {
      flatMap.removeEventListener("mousemove", func)
      flatMap.removeEventListener("mouseleave", mouseLeave)
    }
  })


  return (
  <main className="home-page">

    <section id="home-hero" className="home-hero-section">
      <div className="flex-row align-center justify-center">
        <div className="flex-column flex-1 home-hero-text">
          <h1 className="title">Lake District Walks Over The Wainwrights</h1>
          <p>From Northern to Far-Eastern, whatever your next Wainwright, walk it with Wainroutes.</p>
          <Link to="/walks" className="primary button">Find your next route</Link>
        </div>

        <FlatMap />
      </div>
    </section>

    {/* <section className="home-hero-section">
      <div className="flex-column align-center justify-center text-center">
        <h1 className="title">Love your next Lake District walk</h1>
        <Link to="/walks" className="primary button">Find a walk</Link>
      </div>
    </section> */}

    <section>
      <div className="flex-column align-center">
        <h2 className="heading">Featured routes</h2>
        <div className="flex-row home-featured-container">
          <div className="home-featured-walk"></div>
          <div className="home-featured-walk"></div>
          <div className="home-featured-walk"></div>
        </div>
      </div>
    </section>

    <section className="highlighted-section">
      <div className="grid-two-left align-center">
        <div className="flex-column">
          <h2 className="heading">Wainwrights</h2>
          <p>
            In the 1950s Alfred Wainwright began to release his series of books covering the Lakeland Fells.
            In seven books he wrote about 214 of the most significant and noteworthy peaks.
            Since then, it has become a popular goal among fell enthusiasts to climb all mountains featured in these books, which became known as 'The Wainwrights'.
          </p>
          <button>Check them out →</button>
        </div>

        <div className="flex-column align-center text-center">
          <div className="donut circle">
            <p><span className="wainwright-count">78</span> of 214 Wainwrights</p>
            <div className="progress">
              <div className="circle"></div>
            </div>
          </div>
          <p className="secondary-text">*we're adding to this every month!</p>
        </div>
      </div>
    </section>

    <section>
      <div className="grid-two-right">
        <img src={HerdyImage} alt="A herdwick sheep in the mountains." className="home-about-image" />

        <div className="flex-column">
          <h2 className="heading">About wainroutes</h2>
          <p>
            In the 1950s Alfred Wainwrights began to release his series of books covering the Lakeland Fells.
            In seven books he wrote about 214 of the most significant and noteworthy peaks.
            This site aims to provide walks to climb all mountains referenced by him.
          </p>
        </div>
      </div>
    </section>

  </main>
  )
}