import './App.css';

import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import { NotFoundPage } from './pages/error/notfound';

import { HomePage } from './pages/Home';
import { WalksPage } from './pages/WalksPage';
import { WalkPage } from './pages/WalkPage';
import { HillsPage } from './pages/HillsPage';
import { HillPage } from './pages/HillPage';
import { WeatherPage } from './pages/WeatherPage';


export default function App() {

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (<>
    <Navbar />
    {/* <div className="App text--default"> */}
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/walk/" element={<Navigate to="/walks" />} />
        <Route path="/walks/" element={<WalksPage />} />
        <Route path="/walk/:slug" element={<WalkPage />} />

        <Route path="/mountains/" element={<HillsPage />} />
        <Route path="/mountain/:slug" element={<HillPage />} />

        <Route path="/weather/" element={<WeatherPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    {/* </div> */}
    <Footer />
  </>)
}
