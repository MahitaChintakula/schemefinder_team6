import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Navbar from '../Navbar';

vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
}));

vi.mock('../../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key) => {
      const translations = {
        'navbar.logo': 'SchemeFinder',
        'navbar.login': 'Login',
        'navbar.getStarted': 'Get Started',
        'navbar.dashboard': 'Dashboard',
        'navbar.logout': 'Logout',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('../LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher">EN/TE</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderNavbar = () =>
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

describe('Navbar Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });


  test('renders navbar with logo text', () => {
    renderNavbar();
    expect(screen.getByText('SchemeFinder')).toBeInTheDocument();
  });

  test('renders Login link when not logged in', () => {
    renderNavbar();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('does not render Logout when not logged in', () => {
    renderNavbar();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  test('renders language switcher', () => {
    renderNavbar();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  test('renders hamburger menu', () => {
    renderNavbar();
    expect(document.querySelector('.hamburger')).toBeInTheDocument();
  });


  test('hamburger click toggles mobile menu active class', () => {
    renderNavbar();
    const hamburger = document.querySelector('.hamburger');
    fireEvent.click(hamburger);
    expect(document.querySelector('.nav-menu.active')).toBeInTheDocument();
  });

  test('logo links to home page', () => {
    renderNavbar();
    const logoLink = screen.getByText('SchemeFinder').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  test('login link navigates to /login', () => {
    renderNavbar();
    const loginLink = screen.getByText('Login').closest('a');
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
