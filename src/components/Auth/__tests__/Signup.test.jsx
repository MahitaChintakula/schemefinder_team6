import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Signup from '../Signup';

vi.mock('../../../services/api', () => ({
  signupUser: vi.fn(),
}));

vi.mock('../../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key) => {
      const translations = {
        'signup.title': 'Create Account',
        'signup.subtitle': 'Join us today',
        'signup.fullName': 'Full Name',
        'signup.fullNamePlaceholder': 'Enter your full name',
        'signup.email': 'Email',
        'signup.emailPlaceholder': 'Enter your email',
        'signup.password': 'Password',
        'signup.passwordPlaceholder': 'Enter your password',
        'signup.passwordHint': 'Must have uppercase and number',
        'signup.createAccount': 'Create Account',
        'signup.creatingAccount': 'Creating Account...',
        'signup.hasAccount': 'Already have an account?',
        'signup.signIn': 'Sign In',
        'signup.errors.nameRequired': 'Name is required',
        'signup.errors.nameMin': 'Name must be at least 3 characters',
        'signup.errors.emailRequired': 'Email is required',
        'signup.errors.emailInvalid': 'Email is invalid',
        'signup.errors.passwordRequired': 'Password is required',
        'signup.errors.passwordMin': 'Password must be at least 6 characters',
        'signup.errors.passwordStrength': 'Password must contain uppercase and number',
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

const renderSignup = () =>
  render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );

describe('Signup Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  

  test('renders signup title', () => {
    renderSignup();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  test('renders full name input', () => {
    renderSignup();
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
  });

  test('renders email input', () => {
    renderSignup();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  test('renders password input', () => {
    renderSignup();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  test('renders Sign In link for existing users', () => {
    renderSignup();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });


  test('shows error when full name is empty', async () => {
    renderSignup();
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  test('shows error when name is less than 3 characters', async () => {
    renderSignup();
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { name: 'fullName', value: 'AB' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();
    });
  });

  test('shows error when email is empty', async () => {
    renderSignup();
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { name: 'fullName', value: 'John Doe' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  test('shows error for invalid email format', async () => {
    renderSignup();
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { name: 'fullName', value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { name: 'email', value: 'notanemail' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });
  });

  test('shows error when password lacks uppercase and number', async () => {
    renderSignup();
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { name: 'fullName', value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { name: 'email', value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { name: 'password', value: 'weakpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    await waitFor(() => {
      expect(screen.getByText('Password must contain uppercase and number')).toBeInTheDocument();
    });
  });


  test('calls signupUser with correct data on valid submit', async () => {
    const { signupUser } = await import('../../../services/api');
    signupUser.mockResolvedValue({ message: 'Signup successful' });

    renderSignup();
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { name: 'fullName', value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { name: 'email', value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { name: 'password', value: 'Test123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(signupUser).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Test123',
      });
    });
  });

  test('navigates to /login after successful signup', async () => {
    const { signupUser } = await import('../../../services/api');
    signupUser.mockResolvedValue({ message: 'Signup successful' });

    renderSignup();
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { name: 'fullName', value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { name: 'email', value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { name: 'password', value: 'Test123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
