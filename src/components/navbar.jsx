import "./navbar.css";

import { useState } from "react";
import { Link } from "react-router-dom";


export function Navbar() {

  const [darkMode, setDarkMode] = useState(false);

  function toggleDarkMode() {
    setDarkMode(prev => !prev);
    if (darkMode) document.body.classList.remove('darkmode');
    else document.body.classList.add('darkmode');
  }

  function toggleMobileNav() {
    const nav = document.getElementById("navbar-nav");
    if (nav.getAttribute("data-status") === "open") {
      nav.setAttribute("data-status", "closed");
    } else {
      nav.setAttribute("data-status", "open");
    }
  }

  return (
    <header className="navbar">

      <svg className="navbar-mountains" xmlns="http://www.w3.org/2000/svg" viewBox="0 -8.22648 58.96 8.226">
        <path d="M0 0C1.685-1.929 1.465-4.343 3.5-5.62c1.058.08.699.539 1.836 1.317 1.057.659 1.636.34 2.534.719 1.057.299 1.556 2.113 3.172 2.175 1.037.038 2.1547-1.81 2.394-2.875.259-1.197 1.337-2.095 2.354-2.813.998-.559 1.736.997 2.953 1.396 1.029.106 1.747 1.163 2.745 1.403.798.218 1.376-1.737 2.753-1.996.998-.3 1.098 1.017 2.295 2.234.975 1.068 1.225 2.428 2.079 1.376 1.018.033 1.478-1.117 2.037-1.379 1.051-2.004.919 1.314 3.186 1.905 1.741.23 1.478-2.332 3.383-3.482 1.117-.788 1.708 1.018 3.318 1.445 2.073.431 3.421-4.501 5.487-3.995 2.107-.169 2.529 5.016 9.147 7.545 1.097.394 2.369.575 3.787.636" />
      </svg>

      <div className="navbar-left">
        <button className="nav-button navbar-mobile-only" onClick={toggleMobileNav}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>
        </button>

        <Link to="/" className="navbar-navtitle">wainroutes</Link>
        <nav id="navbar-nav" className="navbar-nav">
          <Link className="navbar-navlink" to="/walks">walks</Link>
          <Link className="navbar-navlink" to="/mountains">mountains</Link>
          <Link className="navbar-navlink" to="/weather">weather</Link>
          <Link className="navbar-navlink" to="/travel">travel</Link>
        </nav>
      </div>

      <div className="navbar-right">
        <button className="nav-button nav-button-rotate">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>

    </header>
  )
}