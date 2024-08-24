import './App.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/home';
import { WalkPage } from './pages/walk';
import { NotFoundPage } from './pages/notfound';
import { Navbar } from './components/nav';
import { EditorPage } from './pages/gpx-editor';


function App() {

  return (<>
  <Routes>
    <Route path="/" element={<>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/walk/"  element={<Navigate to="/walks" />} />
          <Route path="/walk/:slug"  element={<WalkPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>      
    </>} />

    <Route path="/gpx-editor" element={<EditorPage />} />    
  </Routes>

  </>);
}

export default App;
