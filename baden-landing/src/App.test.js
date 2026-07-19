import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the hero headline', () => {
  render(<App />);
  const headline = screen.getByText(/жизнь, которую стоит/i);
  expect(headline).toBeInTheDocument();
});
