import './App.css';

import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import { NotFoundPage } from './pages/error/NotFoundPage';

import { HomePage } from './pages/Home';
import { WalksPage } from './pages/WalksPage';
import { WalkPage } from './pages/WalkPage';
import { HillsPage } from './pages/HillsPage';
import { HillPage } from './pages/HillPage';
import { WeatherPage } from './pages/WeatherPage';


export default function App() {

  const [lastPoppedPage, setLastPoppedPage] = useState(null)
  window.onpopstate = e => {
    setLastPoppedPage(e?.state?.key)
  }

  const { key } = useLocation();
  useEffect(() => {
    console.log(key, lastPoppedPage)
    if (key !== lastPoppedPage) window.scrollTo(0, 0);
  }, [key]);


  return (<>
    <Navbar />
    {/* <div className="App text--default"> */}
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/walk/" element={<Navigate to="/walks" />} />
        <Route path="/walks/" element={<WalksPage />} />
        <Route path="/walks/:slug" element={<WalkPage />} />

        <Route path="/wainwrights/" element={<HillsPage />} />
        <Route path="/wainwrights/:slug" element={<HillPage />} />

        <Route path="/weather/" element={<WeatherPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    {/* </div> */}
    <Footer />
  </>)
}
