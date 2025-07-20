import './App.css';

import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import { NotFoundPage } from './pages/error/NotFoundPage';

import { HomePage } from './pages/HomePage';
import WalksPage from './pages/WalksPage/WalksPage';
import { WalkPage } from './pages/WalkPage/WalkPage';
import { HillsPage } from './pages/HillsPage';
import { HillPage } from './pages/HillPage';
import { WeatherPage } from './pages/WeatherPage';
import TravelPage from './pages/TravelPage';

import ContextProvider from './contexts/ContextProvider';


export default function App() {

  const [lastPoppedPage, setLastPoppedPage] = useState(null)
  window.onpopstate = e => {
    setLastPoppedPage(e?.state?.key)
  }

  const { key, pathname } = useLocation();
  useEffect(() => {
    if (key !== lastPoppedPage) window.scrollTo(0, 0);
  }, [pathname]);


  return (
    <ContextProvider>
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/walk/" element={<Navigate to="/walks" />} />
          <Route path="/walks/" element={<WalksPage />} />
          <Route path="/walks/:slug" element={<WalkPage />} />

          <Route path="/wainwrights/" element={<HillsPage />} />
          <Route path="/wainwrights/:slug" element={<HillPage />} />

          <Route path="/weather/" element={<WeatherPage />} />

          <Route path="/travel/" element={<TravelPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      <Footer />
    </ContextProvider>
  )
}
