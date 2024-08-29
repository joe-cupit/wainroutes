import "../styles/walks.css";

import { Link } from "react-router-dom";
import { useWalks } from "../hooks/useWalks";
import { Fragment } from "react";

import hillData from "../assets/hillData";

import preview_1 from "../assets/preview_1.png";
import preview_2 from "../assets/preview_2.png";
const previews = [preview_1, preview_2];


export function WalksPage() {

  const walkData = Object.values(useWalks(null));

  return (
    <main className="walks-page">
      <header className="walks-page--heading">
        <h1 className="text--heading">walks</h1>
      </header>

      <section className="walks-page--walks">
        {walkData?.map((walk, key) => {
          return <WalkCard key={key} walk={walk} index={key} />
        })}
      </section>
    </main>
  )
}


function WalkCard({ walk, index }) {
  const hills = walk?.wainwrights?.sort((a, b) => hillData[b].height - hillData[a].height);

  const toggleFavourite = (e) => {
    e.preventDefault();
    e.target.classList.toggle("walk-card--favourited");
  }

  return (
    <Link to={`/walk/${walk.slug}`} className="walks-page--walk-card">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
           className="walks-page--walk-card-fav"
           onClick={toggleFavourite}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>

      <div className="walks-page--walk-image">
        <img src={previews[index]} alt={walk.title + " Preview Map"} loading="lazy" />
      </div>
      <div className="walks-page--walk-data">
        <h3 className="walks-page--walk-title text--smallheading" title={walk?.name}>{walk?.name}</h3>
        <p className="walks-page--walk-hills text--default">{hills?.slice(0, 3).map((hill, index) => {
          return (
            <Fragment key={index}>
              {index !== 0 && ", "}
              {hillData?.[hill]?.name}
            </Fragment>
          )
        })} {hills?.slice(3).length > 0 && <i>(and {hills?.slice(3).length} more)</i>}
        </p>
        <p className="walks-page--walk-details text--secondary">
          {walk?.length}km • {walk?.total_elevation}m • {walk?.estimated_time} • {walk?.wainwrights?.length} hills
        </p>
      </div>
    </Link>
  )
}