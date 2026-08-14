import AuthPage from './pages/Auth.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import CarListPage from "./pages/CarListPage.jsx";
import HouseListPage from "./pages/HouseListPage.jsx";
import CarDetailPage from "./pages/CarDetailPage.jsx";
import HouseDetailPage from "./pages/HouseDetailPage.jsx";
import CarCreatePage from "./pages/CarCreatePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-cars" element={<CarListPage />} />
        <Route path="/all-houses" element={<HouseListPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/car/:id" element={<CarDetailPage />} />
        <Route path="/house/:id" element={<HouseDetailPage />} />
        <Route path = "/araba-ilan-olustur" element={<CarCreatePage />}/>

      </Routes>
    </BrowserRouter>
  );
}
 