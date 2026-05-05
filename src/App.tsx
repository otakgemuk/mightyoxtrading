import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import FirmProfile from "./pages/FirmProfile";
import Calculators from "./pages/Calculators";
import EducationalPortal from "./pages/EducationalPortal";
import CountryChecker from "./pages/CountryChecker";
import RulesHub from "./pages/RulesHub";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/compare/:slug" element={<FirmProfile />} />
        <Route path="/calculators" element={<Calculators />} />
        <Route path="/calculators/:type" element={<Calculators />} />
        <Route path="/calculators/:type/:firmId" element={<Calculators />} />
        <Route path="/learn" element={<EducationalPortal />} />
        <Route path="/countries" element={<CountryChecker />} />
        <Route path="/rules" element={<RulesHub />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
