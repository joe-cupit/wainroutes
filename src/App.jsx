import './App.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/home';
import { WalkPage } from './pages/walk';
import { HillPage } from './pages/hill';
import { NotFoundPage } from './pages/notfound';
import { Navbar } from './components/nav';
import { EditorPage } from './pages/gpx-editor';


function App() {

  return (<>
  <Routes>
    <Route path="/gpx-editor" element={<EditorPage />} />  
    <Route path="*" element={<>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/walk/"  element={<Navigate to="/walks" />} />
          <Route path="/walk/:slug"  element={<WalkPage />} />

          <Route path="/mountain/:slug"  element={<HillPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>      
    </>} />  
  </Routes>

  </>);
}

export default App;
