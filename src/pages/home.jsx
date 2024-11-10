import "./Home.css";

import { Link } from "react-router-dom";
import HerdyImage from "../assets/images/home/herdy.jpeg"
import FlatMap from "../components/FlatMap";


export function HomePage() {

  document.title = "Wainroutes | Lake District Wainwright Walks";


  return (
  <main className="home-page">

    <section>
      <FlatMap />
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
            <p><span className="wainwright-count">77</span> of 214 Wainwrights</p>
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