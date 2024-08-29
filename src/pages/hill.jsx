import "../styles/hill.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


export function HillPage() {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);

  const [hillData, setHillData] = useState(null);
  useEffect(() => {
    fetch(`/mountains/wainwrights.json`)
      .then(response => response.text())
      .then(responseText => {
        setHillData(JSON.parse(responseText)[slug]);
        setLoading(false);
      });
  }, [slug]);

  return (
  <main className="hill-page">
    {!hillData
      ? loading
        ? <></>
        : <header className="hill-page--header">
          <h1 className="hill-page--title text--heading">{"This mountain doesn't exist?"}</h1>
          <p className="hill-page--intro text--subtext">Did you mean...</p>
        </header>
      : <>
        <header className="hill-page--header">
          <svg xmlns="http://www.w3.org/2000/svg"
               className="hill-page--marker"
               viewBox="0 0 24 24"
               fill={`var(--wain-book-${hillData.book})`}
          >
            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
          </svg>

          <span>
            <h1 className="hill-page--title text--heading">{hillData?.name}</h1>
            <p className="hill-page--intro text--subtext">{hillData?.heightMetres}m</p>            
          </span>
        </header>
        </>
    }
  </main>
  )
}