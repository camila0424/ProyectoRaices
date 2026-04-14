import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import AuthLayout from "./components/common/AuthLayout";
import LandingPage from "./pages/LandingPage";
import AuthChoice from "./pages/auth/AuthChoice";
import RegisterManual from "./pages/auth/RegisterManual";
import LoginPage from "./pages/auth/LoginPage";
import UserIntent from "./pages/selection/UserIntent";
import WorkerSearch from "./pages/worker/WorkerSearch";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import CreateJob from "./pages/employer/CreateJob";
import AuthCallback from "./pages/auth/AuthCallback";
import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Páginas públicas — con Header público y Footer */}
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/registro"
          element={
            <Layout>
              <AuthChoice />
            </Layout>
          }
        />
        <Route
          path="/registro/manual"
          element={
            <Layout>
              <RegisterManual />
            </Layout>
          }
        />
        <Route
          path="/registro/tipo"
          element={
            <Layout>
              <UserIntent />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Páginas autenticadas — con Header con cerrar sesión y Footer */}
        <Route
          path="/busco-empleo"
          element={
            <AuthLayout>
              <WorkerSearch />
            </AuthLayout>
          }
        />
        <Route
          path="/dashboard-empleador"
          element={
            <AuthLayout>
              <EmployerDashboard />
            </AuthLayout>
          }
        />
        <Route
          path="/publicar-empleo"
          element={
            <AuthLayout>
              <CreateJob />
            </AuthLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;