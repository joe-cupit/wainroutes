import "./HomePage.css";

import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Walk } from "./WalkPage/WalkPage";
import setPageTitle from "../hooks/setPageTitle";
import { useWalks } from "../hooks/useWalks";
import FlatMap from "../components/FlatMap";
import WalkCard from "../components/WalkCard";
import HerdyImage from "../assets/images/home/herdy.jpeg";


export function HomePage() {

  setPageTitle("");

  const MapWidth = 518;
  const MapHeight = 614;
  const HalfWidth = MapWidth/2;
  const HalfHeight = MapHeight/2;

  const walks = useWalks() as { [slug: string] : Walk };

  useEffect(() => {

    function throttle(callback: CallableFunction, wait: number) {
      var timeout: number | undefined;
      return function(e: Event) {
        if (timeout) return;
        timeout = setTimeout(() => (callback(e), timeout=undefined), wait);
      }
    }

    const mapBounds = document.getElementById("flat-map")?.getBoundingClientRect();
    const xBound = mapBounds?.x ?? 0;
    const yBound = mapBounds?.y ?? 0;

    const centerX = xBound + HalfWidth;
    const centerY = yBound + HalfHeight;

    const maxX = xBound - HalfWidth / 1.75;
    const minX = xBound + MapWidth + HalfWidth / 1.75;

    function mouseListener(e: MouseEvent) {

      const originX = centerX - (Math.min(minX, Math.max(maxX, e.pageX)) - HalfWidth);
      const originY = centerY - (Math.min(yBound+MapHeight, Math.max(yBound, e.pageY)) - HalfHeight);
      const origin = `${originX}px ${originY}px`;

      images.forEach((image: HTMLElement, index: number) => {
        if (index === 0) return;

        // setTimeout(() => {image.style.transformOrigin = origin}, 1000)
        image.style.transformOrigin = origin;

        // image.animate({ 
        //   transformOrigin: origin
        // }, { duration: 750, fill: "forwards", easing: "ease" });
      })
    }

    function mouseLeave() {
      if (!flatMap) return;

      flatMap.querySelectorAll("img").forEach((image, index) => {
        if (index === 0) return;

        // image.style.transformOrigin = "66% 66%";
        setTimeout(() => {
          image.style.transformOrigin = "66% 66%";
          // image.animate({ 
          //   transformOrigin: "66% 66%"
          // }, { duration: 250, fill: "forwards", easing: "ease" });
        }, 50)
      })
    }


    const func = throttle(mouseListener, 10);

    const flatMap = document.getElementById("home-hero");
    const images = flatMap?.querySelectorAll("img") ?? [];

    if (flatMap) flatMap.addEventListener("mousemove", func);
    // flatMap.addEventListener("mouseleave", mouseLeave);

    return () => {
      if (flatMap) {
        flatMap.removeEventListener("mousemove", func);
        flatMap.removeEventListener("mouseleave", mouseLeave);
      }
    }
  }, [])


  return (
  <main className="home-page">

    <section id="home-hero" className="home-hero-section">
      <div className="flex-row align-center justify-center">
        <div className="flex-column flex-1 home-hero-text">
          <h1 className="title">Lake District Walks Over The Wainwrights</h1>
          <p>From Northern to Far-Eastern, whatever your next Wainwright, walk it with Wainroutes.</p>
          <Link to="/walks" className="primary button">Find your next route</Link>
        </div>

        <FlatMap width={MapWidth} height={MapHeight} />
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
        <div className="flex-row justify-center home-featured-container">
          <WalkCard walk={walks["the-kentmere-horseshoe"]} />
          <WalkCard walk={walks["a-coledale-horseshoe"]} />
          <WalkCard walk={walks["the-old-man-of-coniston"]} />
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
          <Link to="/wainwrights" className="primary button">Check them out →</Link>
        </div>

        <div className="flex-column align-center text-center">
          <div className="donut circle">
            <p><span className="wainwright-count">81</span> of 214 Wainwrights</p>
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
            Wainroutes is a work-in-progress passion project.
          </p>
        </div>
      </div>
    </section>

  </main>
  )
}