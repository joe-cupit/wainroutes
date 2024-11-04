import { Link } from "react-router-dom";
import "./Footer.css";


export default function Footer() {
  return (
    <footer>
      <div className="flex-column align-center">
        <div className="flex-row justify-apart footer-container">
          <div>
            <h6 className="title">wainroutes</h6>
            <p>"no pain, no wain" - LT</p>
          </div>

          <div className="flex-row footer-links">
            <ul className="flex-column footer-list">
              <li className="bold">Walking</li>
              <li><Link to="/walks">Walks</Link></li>
              <li><Link to="/weather">Weather</Link></li>
              <li><Link to="/travel">Travel</Link></li>
              <li><Link to="/safety">Safety</Link></li>
            </ul>

            <ul className="flex-column footer-list">
              <li className="bold">Mountains</li>
              <li><Link to="/mountains">Wainwrights</Link></li>
              <li><Link to="/other">Other</Link></li>
            </ul>

            <ul className="flex-column footer-list">
              <li className="bold">Extras</li>
              <li><Link to="/editor">GPX Editor</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        <p className="secondary-text">&copy; 2024, Joe Cupit</p>
      </div>
    </footer>
  )
}