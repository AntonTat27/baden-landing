import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { UnitsProvider } from './context/UnitsContext';
import NavBar from './premium/NavBar';
import Footer from './premium/Footer';
import PremiumHome from './pages/PremiumHome';
import ResidenceDetail from './pages/ResidenceDetail';

// The premium single-page site's own chrome (nav + footer wrap every page in
// this layout). Kept exactly as it was — this is the deployed vibe.
function PremiumLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-baden-dark text-baden-on-dark font-sans">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <UnitsProvider>
      {/* PUBLIC_URL basename keeps routing correct under the GitHub Pages subpath */}
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route element={<PremiumLayout />}>
            <Route path="/" element={<PremiumHome />} />
            <Route path="/residence/:id" element={<ResidenceDetail />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </UnitsProvider>
    </LanguageProvider>
  );
}

export default App;
