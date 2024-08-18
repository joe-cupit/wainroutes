import "../styles/notfound.css";

import { Link } from "react-router-dom";


export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <h1>404: Page not found</h1>
      <Link to="/" >back to home</Link>
    </main>
  )
}