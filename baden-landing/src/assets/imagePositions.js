import heroImg from './images/hero.jpg';
import arrivalImg from './images/arrival.jpg';
import poolImg from './images/showcase-pool.jpg';
import groundsImg from './images/showcase-grounds.jpg';
import conciergeImg from './images/showcase-concierge.jpg';

// CROP FIX — all five source photos are portrait renders where the actual
// architecture sits low in the frame (sky/sea dominates the top). When used
// with object-cover in wide/short containers, default centering crops out
// the building almost entirely. This map biases object-position toward the
// bottom band per image, tuned individually since the bias needed differs
// (hero/arrival are heavily sky-dominant, pool/grounds are tight aerial
// crops that are already fine at center).
export const IMAGE_POSITION = new Map([
  [heroImg, 'center 85%'],
  [arrivalImg, 'center 92%'],
  [poolImg, 'center 50%'],
  [groundsImg, 'center 50%'],
  [conciergeImg, 'center 75%'],
]);

export function positionFor(img, fallback = 'center 50%') {
  return IMAGE_POSITION.get(img) || fallback;
}
