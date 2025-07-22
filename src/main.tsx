import './index.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import NoticeBanner from './components/NoticeBanner';


const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <NoticeBanner />
    <div style={{display: "flex", flexDirection: "column", position: "relative", minHeight: "100dvh"}}>
      <App />
    </div>
  </BrowserRouter>
);

// import ComingSoon from './ComingSoon';
// root.render(<ComingSoon />)
