import "../styles/notfound.css";

import { useNavigate } from "react-router-dom";


export function NotFoundPage() {

  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <h1 className="text--title">404: Page not found</h1>
      <button onClick={() => {navigate(-1)}} className="not-found--go-back text--subheading">go back</button>
    </main>
  )
}