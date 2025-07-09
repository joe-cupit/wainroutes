import { useCallback, useEffect, useState } from 'react';
import { PlusIcon } from './Icons';
import './NoticeBanner.css';


export default function NoticeBanner() {

  const [display, setDisplay] = useState(false);

  useEffect(() => {
    const shouldClose = localStorage.getItem("user-has-closed-banner");

    if (shouldClose) setDisplay(false);
    else setDisplay(true);
  }, [])

  const closeBanner = useCallback(() => {
    console.log("helo")
    localStorage.setItem("user-has-closed-banner", "true");
    setDisplay(false);
  }, [])


  if (display) {
    return (
      <div className='notice-banner'>
        <p>I'm still working to improve this site, please email any issues to <a href='mailto:joe@wainroutes.co.uk'>joe@wainroutes.co.uk</a></p>
        <button
          className='notice-banner__close'
          title='Dismiss notice'
          onClick={() => closeBanner()}
        >
          <PlusIcon />
        </button>
      </div>
    )
  }
  else return <></>
}
