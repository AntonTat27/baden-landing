import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { UNITS } from '../data/units';

// Listings come from the Go backend (backend/, managed at /admin). The static
// UNITS in data/units.js are the first paint and the fallback when no API is
// configured (e.g. the GitHub Pages build) or it can't be reached.
const API_URL = process.env.REACT_APP_API_URL;

const UnitsContext = createContext({ units: UNITS, ready: true });

export function UnitsProvider({ children }) {
  const [units, setUnits] = useState(UNITS);
  // false while the API request is in flight — lets a direct link to a
  // listing that only exists server-side wait instead of redirecting home.
  const [ready, setReady] = useState(!API_URL);

  useEffect(() => {
    if (!API_URL) return;
    let cancelled = false;
    fetch(`${API_URL}/api/listings`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((list) => {
        if (cancelled) return;
        // Uploaded images are stored as server-relative paths (/uploads/…).
        setUnits(list.map((u) => (u.image.startsWith('/') ? { ...u, image: API_URL + u.image } : u)));
      })
      .catch((err) => console.warn('Listings API unavailable, using bundled data:', err))
      .finally(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ units, ready }), [units, ready]);
  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
}

export function useUnits() {
  return useContext(UnitsContext);
}
