import "./HillPage.css";

import { Link, useParams } from "react-router-dom";

import { useHills } from "../hooks/useHills";
import setPageTitle from "../hooks/setPageTitle";
import { displayElevation } from "../utils/unitConversions";
import { Fragment, useMemo } from "react";
import { useWalks } from "../hooks/useWalks";
import { Walk } from "./WalkPage/WalkPage";
import WalkCard from "../components/WalkCard";
import haversineDistance from "../utils/haversine";


const BookNumbers : {[book : number]: string} = {
  1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven"
}
const BookTitles : {[book : number]: string} = {
  1: "The Eastern Fells", 2: "The Far Eastern Fells", 3: "The Central Fells", 4: "The Southern Fells", 5: "The Northern Fells", 6: "The North Western Fells", 7: "The Western Fells"
}


export type Hill = {
  slug: string;
  name: string;
  name_secondary?: string;
  height: number;
  prominence: number;
  latitude: number;
  longitude: number;
  gridReference: string;
  book: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  hasWalk: boolean;
  nearbyFells?: string[];

  distance?: number;
}


export function HillPage() {
  const { slug } = useParams();
  const hillData = useHills(slug) as Hill;
  const walkData = Object.fromEntries(
    Object.entries(useWalks() as {[slug: string]: Walk}).filter(([walkSlug, walk]) => walk.wainwrights?.includes(slug ?? ""))
  );

  setPageTitle(hillData?.name ?? "The Wainwrights");
  
  const bookNum = useMemo(() => hillData?.book, [hillData]);


  const closestWalks = useMemo(() => {
    if (!hillData) return [];

    let hills = useHills() as {[slug : string]: Hill};

    for (let hillSlug of Object.keys(hills)) {
      if (hillSlug === slug) {
        hills[hillSlug].distance = Infinity;
        continue;
      }

      hills[hillSlug].distance = haversineDistance([hillData.longitude, hillData.latitude], [hills[hillSlug].longitude ?? 0, hills[hillSlug].latitude ?? 0]) / 1000;
    }

    const orderedHills = Object.values(hills).sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));
    return orderedHills.slice(0, 4);
  }, [hillData])


  return (
    <main className="hill-page">

      <section>

        <div className="hill__main">
          {/* <HillBook bookNum={bookNum} /> */}

          <div>
            <p className="hill__breadcrumbs"><Link to="/wainwrights">Wainwrights</Link> / <Link to={"/wainwrights?book="+bookNum}>{BookTitles[bookNum]}</Link></p>
            <div className="hill__title">
              <h1 className="title">{hillData.name}</h1>
              <p className="hill__title-elevation">{displayElevation(hillData.height)}</p>
            </div>
          </div>

          <p>
            A few sentences about the mountain, maybe a fun fact or two. Historical/cultural moments to talk about. Unique features too, with possible common ways people climb it.
          </p>

          <div className="home__group">
            <h2 className="subheading">Stats</h2>
            <div className="home__stats">
              <h3>Book</h3>
              <p><Link to={"/wainwrights/?book="+bookNum}>{BookTitles[bookNum]}</Link></p>
              <h3>Height</h3>
              <p>{displayElevation(hillData.height)}</p>
              <h3>Prominence</h3>
              <p>{displayElevation(hillData.prominence)}</p>
              <h3>Grid Ref.</h3>
              <p>{hillData.gridReference}</p>
            </div>
          </div>

          <div className="home__group">
            <h2 className="subheading">Walk This Fell</h2>
            {Object.keys(walkData).length > 0
              ? <div className="hill__walks">
                  {Object.values(walkData).map((walk, index) => {
                    return <WalkCard key={index} walk={walk} />
                  })}
                </div>
              : <p>There are no walks including this fell yet.</p>
            }
          </div>

          {closestWalks.length > 0 &&
            <div className="home__group">
              <h2 className="subheading">Some Nearby Wainwrights</h2>
              <p className="home__nearby-list">
                {closestWalks.map((fell, index) => {
                  return (
                    <Fragment key={index}>
                      <Link to={"/wainwrights/"+fell.slug}>{fell.name}</Link>
                      {index+1 < closestWalks.length && ", "}
                    </Fragment>
                  )
                })}
              </p>
            </div>
          }

        </div>
      </section>

    </main>
  )
}


function HillBook({ bookNum } : { bookNum: number }) {
  return (
    <div className="hill__book" data-book={bookNum}>
      <div className="hill__book-end">
        {"Book " + BookNumbers[bookNum]}
      </div>
      <div className="hill__book-title">
        {BookTitles[bookNum]}
      </div>
      <div className="hill__book-end"></div>
    </div>
  )
}