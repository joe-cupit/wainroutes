import "./Navbar.css";

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";


export function Navbar() {

  function clickListener(e: Event) {
    const mobileTarget = document.getElementById("navbar-mobile");
    if (mobileTarget && !e.composedPath().includes(mobileTarget)) openCloseMobile(false);
  }

  const [showMobile, setShowMobile] = useState(false);
  function openCloseMobile(open: boolean) {
    setShowMobile(open);

    if (open) document.addEventListener("mouseup", clickListener);
    else document.removeEventListener("mouseup", clickListener);
  }

  const { pathname } = useLocation();


  const [stickyNav, setStickyNav] = useState(false);
  const [invisibleNav, setInvisibleNav] = useState(pathname === "/" && window.scrollY < 50);
  const lastScrollY = useRef(0);

  const checkScroll = () => {
    setInvisibleNav(window.scrollY < 50);
    if (window.innerWidth >= 552) return;

    if (window.scrollY <= 0) {
      setStickyNav(false);
      lastScrollY.current = 0;
    }
    else setStickyNav(lastScrollY.current - window.scrollY > 0);

    lastScrollY.current = window.scrollY;
  }

  useEffect(() => {
    window.addEventListener("scroll", checkScroll);

    return () => {
      window.removeEventListener("scroll", checkScroll);
    }
  }, [])


  return (
    <>
      <header
        className={
          "navbar"
          + (pathname === "/" ? " float" : "")
          + (invisibleNav ? " invisible" : "")
          + (stickyNav ? " sticky" : "")
        }
      >

        <div className="flex-row align-center justify-apart">

          <div className="flex-row align-center navbar-left">
            <button className="nav-button navbar-mobile-only" onClick={() => openCloseMobile(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
              </svg>
            </button>

            <Link to="/" className="heading">wainroutes</Link>
          </div>

          <div className="flex-row align-center navbar-right">
            <nav id="navbar-nav" className="flex-row navbar-nav">
              <NavLink to="/walks">walks</NavLink>
              <NavLink to="/wainwrights">wainwrights</NavLink>
              <NavLink to="/weather">weather</NavLink>
              <NavLink to="/travel">travel</NavLink>
            </nav>

            {/* <button className="nav-button nav-button-rotate">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button> */}
          </div>
        </div>
      </header>

      <div id="navbar-mobile" className={"navbar-mobile" + (showMobile ? " active" : "")}>
        <button className="nav-button" onClick={() => openCloseMobile(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="5 5 18 18" strokeWidth="2" stroke="currentColor">
            <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <nav>
          <ul className="flex-column heading">
            <li onClick={() => openCloseMobile(false)}><Link to="/">home</Link></li>
            <li onClick={() => openCloseMobile(false)}><Link to="/walks">walks</Link></li>
            <li onClick={() => openCloseMobile(false)}><Link to="/wainwrights">wainwrights</Link></li>
            <li onClick={() => openCloseMobile(false)}><Link to="/weather">weather</Link></li>
            <li onClick={() => openCloseMobile(false)}><Link to="/travel">travel</Link></li>
          </ul>
        </nav>
      </div>
    </>
  )
}