import AuthPage from './pages/Auth.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import CarListPage from "./pages/CarListPage.jsx";
import HouseListPage from "./pages/HouseListPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-cars" element={<CarListPage />} />
        <Route path="/all-houses" element={<HouseListPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}
 