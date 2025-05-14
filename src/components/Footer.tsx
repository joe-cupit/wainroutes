import "./Footer.css";

import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__main">
          <div className="footer__main-left">
            <h2 className="heading">wainroutes</h2>
            <input type="text"
              className="footer__search-bar"
              placeholder="Find a walk"
            />
          </div>
          <div className="footer__main-right">
            <div className="footer__main-links">
              <h3 className="subheading">Explore</h3>
              <Link to="/walks">Walks</Link>
              <Link to="/walks">Map</Link>
              <Link to="/wainwrights">Wainwrights</Link>
              <Link to="/weather">Weather</Link>
            </div>
            <div className="footer__main-links">
              <h3 className="subheading">Discover</h3>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>

        <div className="footer__base">
          <p>&#169; 2025 <Link to="/about">Wainroutes</Link></p>
          <p>A site by <a href="https://www.google.com" target="_blank">Joe Cupit</a>.</p>
        </div>
      </div>
    </footer>
  )
}