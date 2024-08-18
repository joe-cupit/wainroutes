import "../styles/walk.css";

import { useParams } from "react-router-dom";


export function WalkPage() {
  const { name } = useParams();

  return (
  <main className="walk-page">
    <header>
      <h1>{name}</h1>
    </header>
  </main>
  )
}