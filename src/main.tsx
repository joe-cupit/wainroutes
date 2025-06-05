import './index.css';

import ReactDOM from 'react-dom/client';
import ComingSoon from './ComingSoon';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import App from './App';
// import EditorApp from './pages/gpx-editor';


const root = ReactDOM.createRoot(document.getElementById('root')!);
// root.render(
//   <BrowserRouter>
//     <Routes>
//       <Route path="/editor" element={<EditorApp />} />
//       <Route path="*" element={<App />} />
//     </Routes>
//   </BrowserRouter>
// );
root.render(<ComingSoon />)
