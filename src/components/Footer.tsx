import { Link } from "react-router-dom";
import "./Footer.css";


export default function Footer() {
  return (
    <footer className="page-footer">

      <div className="page-footer_main flex-row justify-apart">
        <div className="page-footer_find flex-column gap-0">
          Find your next route:
          <div className="page-footer_input flex-row align-center">
            <input // type="text"
              placeholder="Search walks..."
            />
            <button className="primary small bottom-left button">Search</button>
          </div>
          <Link to="/walks">View all walks</Link>
        </div>

        <div className="page-footer_links flex-column">
          <Link to="/">Home</Link>
          <Link to="/walks">Walks</Link>
          <Link to="/wainwrights">Wainwrights</Link>
          <Link to="/weather">Weather</Link>
          <Link to="/travel">Travel</Link>
        </div>
      </div>

      <div className="page-footer_base flex-column gap-0">

        <div className="page-footer_links flex-row flex-apart">
          <Link to="/">Home</Link>
          <Link to="/walks">Walks</Link>
          <Link to="/wainwrights">Wainwrights</Link>
          <Link to="/weather">Weather</Link>
          <Link to="/travel">Travel</Link>
        </div>
        
        <Link to="/" className="page-footer_title">wainroutes</Link>

        <div className="page-footer_bottom flex-row flex-apart">
          <div>
            &#169; 2025 <Link to="/about">Wainroutes</Link>
          </div>
          <div>
            A site by <a href="https://www.google.com" target="_blank">Joe Cupit</a>.
          </div>
        </div>
      </div>
    </footer>
  )
}