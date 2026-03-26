import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import LandingPage from "./pages/LandingPage";
import OnboardingRegistro from "./pages/raices/register/OnboardingRegister";
import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing envuelta en Layout (con Header y Footer) */}
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />

        {/* Onboarding sin Layout: pantalla standalone sin Header ni Footer */}
        <Route path="/registro" element={<OnboardingRegistro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;