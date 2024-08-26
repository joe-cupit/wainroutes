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
          <h1 className="hill-page--title text--heading">{hillData?.name}</h1>
          <p className="hill-page--intro text--subtext">{hillData?.heightMetres}m</p>
        </header>
        </>
    }
  </main>
  )
}