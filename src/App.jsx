import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/auth/Landing';
import Register from './pages/auth/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
