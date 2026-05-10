import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../Login';

vi.mock('../../../services/api', () => ({
  loginUser: vi.fn(),
}));

vi.mock('../../../assets/Project_image.png', () => ({
  default: 'mocked-image.png',
}));


vi.mock('../../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key) => {
      const translations = {
        'login.title': 'Login',
        'login.subtitle': 'Welcome back',
        'login.email': 'Email',
        'login.emailPlaceholder': 'Enter your email',
        'login.password': 'Password',
        'login.passwordPlaceholder': 'Enter your password',
        'login.rememberMe': 'Remember Me',
        'login.forgotPassword': 'Forgot Password?',
        'login.signIn': 'Sign In',
        'login.signingIn': 'Signing In...',
        'login.noAccount': "Don't have an account?",
        'login.createAccount': 'Create Account',
        'login.errors.emailRequired': 'Email is required',
        'login.errors.emailInvalid': 'Email is invalid',
        'login.errors.passwordRequired': 'Password is required',
        'login.errors.passwordMin': 'Password must be at least 6 characters',
      };
      return translations[key] || key;
    },
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderLogin = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

describe('Login Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  test('renders login title', () => {
    renderLogin();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('renders email input field', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  test('renders password input field', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  test('renders Sign In button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('renders forgot password link', () => {
    renderLogin();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
  });

  test('renders create account link', () => {
    renderLogin();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });


  test('updates email field on user input', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('updates password field on user input', () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'Test123' } });
    expect(passwordInput.value).toBe('Test123');
  });


  test('shows error when email is empty on submit', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  test('shows error when email format is invalid', async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { name: 'email', value: 'invalidemail' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });
  });

  test('shows error when password is empty on submit', async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('shows error when password is less than 6 characters', async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { name: 'password', value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });


  test('calls loginUser API with correct data on valid submit', async () => {
    const { loginUser } = await import('../../../services/api');
    loginUser.mockResolvedValue({
      statusCode: 200,
      body: { message: 'Login successful', user: { email: 'test@example.com' } },
    });

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { name: 'password', value: 'Test123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Test123',
      });
    });
  });

  test('navigates to /profile-choice on successful login', async () => {
    const { loginUser } = await import('../../../services/api');
    loginUser.mockResolvedValue({
      statusCode: 200,
      body: { message: 'Login successful', user: { email: 'test@example.com' } },
    });

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { name: 'password', value: 'Test123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile-choice');
    });
  });

  test('button is disabled when loading', async () => {
    const { loginUser } = await import('../../../services/api');
    loginUser.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { name: 'password', value: 'Test123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Signing In...' })).toBeDisabled();
    });
  });
});
