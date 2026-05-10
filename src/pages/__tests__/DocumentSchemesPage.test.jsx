import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DocumentSchemesPage from '../DocumentSchemesPage';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
  },
}));

const mockLocation = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useLocation: () => mockLocation() };
});

const sampleSchemes = [
  {
    scheme_name: 'Ayushman Bharat Yojana',
    description: 'Free health coverage up to 5 lakhs',
    required_documents: ['Aadhaar Card', 'Income Certificate'],
    website: 'https://pmjay.gov.in/',
  },
  {
    scheme_name: 'Pradhan Mantri Jan Dhan Yojana',
    description: 'Zero balance bank account',
    required_documents: ['Aadhaar Card', 'Bank Passbook'],
    website: 'https://pmjdy.gov.in/',
  },
];

describe('DocumentSchemesPage', () => {

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('language', 'en');
  });


  test('renders page title in English', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);
    expect(
      screen.getByText('Your Eligible Government Schemes')
    ).toBeInTheDocument();
  });

  test('renders subtitle in English', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);
    expect(
      screen.getByText('Based on your uploaded document')
    ).toBeInTheDocument();
  });

  test('renders all scheme names', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);
    expect(screen.getByText('Ayushman Bharat Yojana')).toBeInTheDocument();
    expect(
      screen.getByText('Pradhan Mantri Jan Dhan Yojana')
    ).toBeInTheDocument();
  });

  test('renders scheme descriptions', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);
    expect(
      screen.getByText('Free health coverage up to 5 lakhs')
    ).toBeInTheDocument();
  });

  test('renders required documents for each scheme', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);
    expect(screen.getAllByText('Aadhaar Card').length).toBeGreaterThan(0);
    expect(screen.getByText('Income Certificate')).toBeInTheDocument();
  });

  test('renders Apply Now button for each scheme', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);
    const applyButtons = screen.getAllByText(/Apply Now/i);
    expect(applyButtons.length).toBe(2);
  });


  test('shows no schemes message when schemes array is empty', () => {
    mockLocation.mockReturnValue({ state: { schemes: [] } });
    render(<DocumentSchemesPage />);
    expect(screen.getByText('No schemes found')).toBeInTheDocument();
  });

  test('shows no schemes when first scheme has placeholder name', () => {
    mockLocation.mockReturnValue({
      state: {
        schemes: [{ scheme_name: 'No eligible schemes found' }],
      },
    });
    render(<DocumentSchemesPage />);
    expect(screen.getByText('No schemes found')).toBeInTheDocument();
  });

  test('loads schemes from localStorage when no location state', () => {
    mockLocation.mockReturnValue({ state: null });
    localStorage.setItem('documentSchemes', JSON.stringify(sampleSchemes));
    render(<DocumentSchemesPage />);
    expect(screen.getByText('Ayushman Bharat Yojana')).toBeInTheDocument();
  });


  test('renders language toggle button showing తెలుగు in English mode', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);
    expect(screen.getByRole('button', { name: 'తెలుగు' })).toBeInTheDocument();
  });

  test('switches to Telugu when toggle button clicked', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);

    fireEvent.click(screen.getByRole('button', { name: 'తెలుగు' }));

    expect(
      screen.getByText('మీకు అర్హమైన ప్రభుత్వ పథకాలు')
    ).toBeInTheDocument();
  });

  test('shows Telugu subtitle after language switch', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);

    fireEvent.click(screen.getByRole('button', { name: 'తెలుగు' }));

    expect(
      screen.getByText('మీరు అప్లోడ్ చేసిన డాక్యుమెంట్ ఆధారంగా')
    ).toBeInTheDocument();
  });

  test('shows Ayushman scheme in Telugu after language switch', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);

    fireEvent.click(screen.getByRole('button', { name: 'తెలుగు' }));

    expect(screen.getByText('ఆయుష్మాన్ భారత్ యోజన')).toBeInTheDocument();
  });

  test('shows Apply Now in Telugu after language switch', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);

    fireEvent.click(screen.getByRole('button', { name: 'తెలుగు' }));

    expect(
      screen.getAllByText('ఇప్పుడే దరఖాస్తు చేయండి →').length
    ).toBeGreaterThan(0);
  });

  test('saves language to localStorage on toggle', () => {
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);

    fireEvent.click(screen.getByRole('button', { name: 'తెలుగు' }));

    expect(localStorage.getItem('language')).toBe('te');
  });

  test('switches back to English from Telugu', () => {
    localStorage.setItem('language', 'te');
    mockLocation.mockReturnValue({ state: { schemes: sampleSchemes } });
    render(<DocumentSchemesPage />);

    fireEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(
      screen.getByText('Your Eligible Government Schemes')
    ).toBeInTheDocument();
  });


  test('shows default documents when required_documents is empty', () => {
    const schemeNoDoc = [
      {
        scheme_name: 'Test Scheme',
        description: 'A test scheme',
        required_documents: [],
        website: 'https://example.com',
      },
    ];
    mockLocation.mockReturnValue({ state: { schemes: schemeNoDoc } });
    render(<DocumentSchemesPage />);
    expect(screen.getByText('Test Scheme')).toBeInTheDocument();
  });
});
