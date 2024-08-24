import "../styles/walk.css";

import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { LakeMap } from "../components/map";


export function WalkPage() {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);

  const [walkData, setWalkData] = useState();
  useEffect(() => {
    fetch(`/walks/walkdata.json`)
      .then(response => response.text())
      .then(responseText => {
        setWalkData(JSON.parse(responseText)[slug]);
        setLoading(false);
      });
  }, [slug]);

  return (
  <main className="walk-page">
    {!walkData
    ? loading
      ? <></>
      : <header className="walk-page--header">
          <h1 className="walk-page--title">{"This walk doesn't {yet} exist"}</h1>
        </header>
    : <>
      <header className="walk-page--header">
        <h1 className="walk-page--title">{walkData?.name}</h1>
        <p className="walk-page--intro">{walkData?.intro}</p>
        <p className="walk-page--intro walk-page--wainwrights">
          Completing {walkData?.wainwrights?.length} Wainwrights:&nbsp;
          {walkData?.wainwrights?.map((wain, index) => {
            return (<><Link to={`/mountain/${wain}`} key={index} className="walk-page--mountain">{wain}</Link>, </>)
          })}
        </p>
      </header>

      <section className="walk-page--details">
        <div className="length">
          Length: {walkData?.length}km
        </div>
        <div className="elevation">
          Total elevation: {walkData?.total_elevation}m
        </div>

        <div className="start-location">
          Start location:
          <span>
            <div>{walkData?.start_lat_lang?.join(", ")}</div>
            <div>{walkData?.start_grid_reference}</div>
            <div>
              <Link to={`https://what3words.com/${walkData?.start_what_three_words?.join(".")}`} target="_blank">{walkData?.start_what_three_words?.join(".")}</Link>
            </div>
            <div>{walkData?.start_post_code}</div>
          </span>
        </div>

        <div className="bus-section">
          Bus connections:
          <span className="bus-section--list">
            {walkData?.busRoutes?.map((bus, index) => {
              const number = bus[0];
              const from = bus[1];
              return (
                <div key={index}
                     className="bus-block"
                     fromtext={from}
                     style={{"backgroundColor": `var(--bus-${number})`}}>
                  {number}
                </div>
              )
            })}
          </span>
        </div>

      </section>

      <section>
        <div className="walk-page--map-container">
          <LakeMap />
        </div>
      </section>

      <section className="walk-page--steps-section">
        {walkData?.steps && Object.keys(walkData?.steps).map((step, index) => {
          return (
            <div key={index} className="walk-page--step">
              <h2 className="walk-page--step-title">{step}</h2>
              <p className="walk-page--step-content">{walkData?.steps?.[step]}</p>
            </div>
          )
        })}
      </section>
      </>
    }
  </main>
  )
}