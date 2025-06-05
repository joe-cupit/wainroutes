import { useEffect } from 'react';
import './App.css';
import './ComingSoon.css';

import LogoImage from "./assets/images/logo.png";


export default function ComingSoon() {

  useEffect(() => {
    document.title = "Wainroutes Coming Soon";
  }, [])


  return (
    <main id="coming-soon">
      {/* <header>
        <h1 className='heading'>wainroutes</h1>
      </header> */}

      <section>
        <img src={LogoImage} />
        <h1 className='title'>Wainroutes Lake District Walks</h1>
        <p>A new site coming soon...</p>
      </section>

      {/* <footer>

      </footer> */}
    </main>
  )
}