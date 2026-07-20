// Placeholder photography — sourced from Unsplash (free to use under the
// Unsplash License, https://unsplash.com/license) until the client supplies
// real photography and renders for the site. Kept as hotlinked remote URLs
// (not bundled) so they're trivial to swap out later.
export const heroImg = 'https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=2400&auto=format&fit=crop';

// Real amenity photography from Beyzade Resort's own site (beyzaderesort.com),
// used here because Beyzade Hotel is a real listing. Hotlinked directly from
// their server — fine for an internal draft, but swap for licensed/owned
// copies (or get their sign-off) before this goes live; see chat note.
export const poolImg = 'https://www.beyzaderesort.com/wp-content/uploads/2023/05/private-pool-3-min.png'; // Kadınlara Özel Havuz — women-only pool
export const groundsImg = 'https://www.beyzaderesort.com/wp-content/uploads/2025/08/restaurant-2-min.png'; // Restoran — restaurant / social areas
export const conciergeImg = 'https://www.beyzaderesort.com/wp-content/uploads/2025/08/Scene-5.png'; // Hamam — Turkish bath / spa

export const HOTEL_IMG = 'https://www.beyzaderesort.com/wp-content/uploads/2025/08/ana-foto-new-2048x2048.jpg'; // Beyzade Resort's own hero/exterior photo
export const VILLA_IMG = 'https://images.unsplash.com/photo-1756887406085-a689fbc8af33?q=80&w=2000&auto=format&fit=crop';
export const LAGOON_IMG = 'https://images.unsplash.com/photo-1503461007167-0e27f216b896?q=80&w=2000&auto=format&fit=crop';
export const RESIDENCES_IMG = 'https://images.unsplash.com/photo-1680197705024-3922023398d8?q=80&w=2000&auto=format&fit=crop';
export const WATER_VILLAS_IMG = 'https://images.unsplash.com/photo-1470214203634-e436a8848e23?q=80&w=2000&auto=format&fit=crop';

// CROP FIX — several source photos are wide/aerial or portrait-oriented and
// need a deliberate object-position bias so the interesting part of the
// frame survives object-cover cropping in short/wide containers.
export const IMAGE_POSITION = new Map([
  [heroImg, 'center 60%'],
  [poolImg, 'center 40%'],
  [groundsImg, 'center 50%'],
  [conciergeImg, 'center 50%'],
  [HOTEL_IMG, 'center 55%'],
  [VILLA_IMG, 'center 55%'],
  [LAGOON_IMG, 'center 50%'],
  [RESIDENCES_IMG, 'center 50%'],
  [WATER_VILLAS_IMG, 'center 55%'],
]);

export function positionFor(img, fallback = 'center 50%') {
  return IMAGE_POSITION.get(img) || fallback;
}
