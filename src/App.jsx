import './App.css';

import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home';
import { WalkPage } from './pages/walk';
import { NotFoundPage } from './pages/notfound';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/walk/:name"  element={<WalkPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
