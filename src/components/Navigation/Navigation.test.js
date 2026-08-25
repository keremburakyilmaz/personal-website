import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';

function renderNavigation(pathname, activeSection = 'top') {
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Navigation
        activeSection={activeSection}
        menuOpen={false}
        setMenuOpen={jest.fn()}
        isScrolled={false}
      />
    </MemoryRouter>
  );
}

test('renders the reference header content and all site destinations', () => {
  renderNavigation('/');

  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /kerem burak yilmaz, back to top/i })).toHaveTextContent('KBY/SYS.IST');
  expect(screen.getByText('ISTANBUL / UTC+3')).toBeInTheDocument();

  const navigation = screen.getByRole('navigation', { name: /primary navigation/i });
  expect(navigation.querySelectorAll('a')).toHaveLength(10);
  expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('active');
});

test('keeps the Lab destination active on nested experiment routes', () => {
  renderNavigation('/lab/minor-omen', '/lab/minor-omen');

  expect(screen.getByRole('link', { name: 'Lab' })).toHaveClass('active');
});
