import "../styles/home.css";

import { Link } from "react-router-dom";
import { LakeMap } from "./map";
import { useState } from "react";


export function HomePage() {

  const [showWainwrights, setShowWainwrights] = useState(false)
  const [showWalkroutes, setShowWalkroutes] = useState(true)

  const handleClick = (e) => {
    e.preventDefault();

    for (let button of document.getElementsByClassName("active")) {
      button.classList.remove("active");
    }
    e.target.classList.add("active");

    switch (e.target.innerText) {
      case "walks":
        setShowWainwrights(false);
        setShowWalkroutes(true);
        break;
      case "mountains":
        setShowWainwrights(true);
        setShowWalkroutes(false);
        break;
      default:
        setShowWainwrights(false);
        setShowWalkroutes(false);
    }
  }

  return (
  <main className="home-page">

    <header>
      <h1>Wainwright Walks</h1>
      <div className="home-page--links">
        <Link to="/walks">walks</Link>
        <Link to="/mountains">mountains</Link>
        <Link to="/weather">weather</Link>
        <Link to="/more">travel</Link>
        {/* <button className={showWalkroutes && "active"} onClick={handleClick}>walks</button>
        <button className={showWainwrights && "active"} onClick={handleClick}>mountains</button>
        <button onClick={handleClick}>weather</button>
        <button onClick={handleClick}>more</button> */}
      </div>
    </header>

    <div className="home-page--map">
      <LakeMap showWainwrights={true} showWalkroutes={true}/>
    </div>

    <div style={{height: "670px"}}></div>
    
  </main>
  )
}