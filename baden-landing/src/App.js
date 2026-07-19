import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import ResidenceDetail from './pages/ResidenceDetail';

function App() {
  return (
      <LanguageProvider>
          {/* Use PUBLIC_URL as basename so Router works correctly when deployed to GitHub Pages under a repo subpath */}
          <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className="min-h-screen flex flex-col bg-baden-base text-baden-cream font-sans">
          <Nav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
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
