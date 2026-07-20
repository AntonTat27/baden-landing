import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import NavBar from './premium/NavBar';
import Footer from './premium/Footer';
import PremiumHome from './pages/PremiumHome';
import ResidenceDetail from './pages/ResidenceDetail';

function App() {
  return (
    <LanguageProvider>
      {/* PUBLIC_URL basename keeps routing correct under the GitHub Pages subpath */}
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className="min-h-screen flex flex-col bg-baden-base text-baden-cream font-sans">
          <NavBar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<PremiumHome />} />
              <Route path="/residence/:id" element={<ResidenceDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
