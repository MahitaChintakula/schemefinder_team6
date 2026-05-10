import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { LanguageProvider, useLanguage } from '../LanguageContext';

vi.mock('../../locales/en.json', () => ({
  default: {
    navbar: { logo: 'SchemeFinder', login: 'Login' },
    login: {
      title: 'Login',
      email: 'Email',
      errors: {
        emailRequired: 'Email is required',
        emailInvalid: 'Email is invalid',
      },
    },
    signup: {
      title: 'Create Account',
    },
  },
}));

vi.mock('../../locales/te.json', () => ({
  default: {
    navbar: { logo: 'స్కీమ్‌ఫైండర్', login: 'లాగిన్' },
    login: {
      title: 'లాగిన్',
      email: 'ఇమెయిల్',
      errors: {
        emailRequired: 'ఇమెయిల్ అవసరం',
        emailInvalid: 'ఇమెయిల్ చెల్లదు',
      },
    },
    signup: {
      title: 'ఖాతా సృష్టించండి',
    },
  },
}));

const TestComponent = () => {
  const { language, setLanguage, t, dir } = useLanguage();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="dir">{dir}</span>
      <span data-testid="translation">{t('login.title')}</span>
      <span data-testid="nested">{t('login.errors.emailRequired')}</span>
      <span data-testid="missing">{t('some.missing.key')}</span>
      <button onClick={() => setLanguage('te')}>Switch to Telugu</button>
      <button onClick={() => setLanguage('en')}>Switch to English</button>
    </div>
  );
};

const renderWithProvider = (initialLang = null) => {
  if (initialLang) {
    localStorage.setItem('language', initialLang);
  }
  return render(
    <LanguageProvider>
      <TestComponent />
    </LanguageProvider>
  );
};



describe('LanguageContext', () => {

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = '';
  });


  test('renders children inside provider', () => {
    renderWithProvider();
    expect(screen.getByTestId('language')).toBeInTheDocument();
  });

  test('throws error when useLanguage used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const BadComponent = () => {
      useLanguage(); // No provider wrapping this
      return <div>Bad</div>;
    };

    expect(() => render(<BadComponent />)).toThrow(
      'useLanguage must be used within LanguageProvider'
    );

    consoleSpy.mockRestore();
  });

 

  test('defaults to English when no language in localStorage', () => {
    renderWithProvider();
    expect(screen.getByTestId('language').textContent).toBe('en');
  });

  test('loads saved language from localStorage if valid', () => {
    renderWithProvider('te');
    expect(screen.getByTestId('language').textContent).toBe('te');
  });

  test('falls back to English for invalid localStorage value', () => {
    localStorage.setItem('language', 'fr'); // unsupported language
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('language').textContent).toBe('en');
  });


  test('switches language to Telugu on button click', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Switch to Telugu'));
    expect(screen.getByTestId('language').textContent).toBe('te');
  });

  test('switches back to English from Telugu', () => {
    renderWithProvider('te');
    fireEvent.click(screen.getByText('Switch to English'));
    expect(screen.getByTestId('language').textContent).toBe('en');
  });


  test('saves language to localStorage when changed', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Switch to Telugu'));
    expect(localStorage.getItem('language')).toBe('te');
  });

  test('updates localStorage back to en when switched', () => {
    renderWithProvider('te');
    fireEvent.click(screen.getByText('Switch to English'));
    expect(localStorage.getItem('language')).toBe('en');
  });


  test('sets document lang attribute to en by default', () => {
    renderWithProvider();
    expect(document.documentElement.lang).toBe('en');
  });

  test('sets document lang attribute to te after switch', async () => {
    renderWithProvider();
    await act(async () => {
      fireEvent.click(screen.getByText('Switch to Telugu'));
    });
    expect(document.documentElement.lang).toBe('te');
  });


  test('returns correct English translation', () => {
    renderWithProvider('en');
    expect(screen.getByTestId('translation').textContent).toBe('Login');
  });

  test('returns correct Telugu translation after switch', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Switch to Telugu'));
    expect(screen.getByTestId('translation').textContent).toBe('లాగిన్');
  });

  test('returns correct nested translation key', () => {
    renderWithProvider('en');
    expect(screen.getByTestId('nested').textContent).toBe('Email is required');
  });

  test('returns the key itself when translation is missing', () => {
    renderWithProvider('en');
    // Your t() function returns the path when key not found
    expect(screen.getByTestId('missing').textContent).toBe('some.missing.key');
  });


  test('dir is ltr for English', () => {
    renderWithProvider('en');
    expect(screen.getByTestId('dir').textContent).toBe('ltr');
  });

  test('dir is ltr for Telugu (as per your code)', () => {
    renderWithProvider('te');
    expect(screen.getByTestId('dir').textContent).toBe('ltr');
  });

});
