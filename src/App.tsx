import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { MapPage } from "@/pages/MapPage";
import { SpotDetailsPage } from "@/pages/SpotDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/spot/:id" element={<SpotDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
