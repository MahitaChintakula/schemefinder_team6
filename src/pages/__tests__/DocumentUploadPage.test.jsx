import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import DocumentUploadPage from '../DocumentUploadPage';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, onClick, disabled, ...props }) => (
      <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
    ),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

global.fetch = vi.fn();

const renderPage = () =>
  render(
    <BrowserRouter>
      <DocumentUploadPage />
    </BrowserRouter>
  );

describe('DocumentUploadPage', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

 

  test('renders page title', () => {
    renderPage();
    expect(screen.getByText(/Document Upload Page/i)).toBeInTheDocument();
  });

  test('renders subtitle text', () => {
    renderPage();
    expect(
      screen.getByText(/Upload Aadhaar document to find eligible schemes/i)
    ).toBeInTheDocument();
  });

  test('renders file input', () => {
    renderPage();
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  test('renders upload button', () => {
    renderPage();
    expect(
      screen.getByRole('button', { name: /Upload & Find Schemes/i })
    ).toBeInTheDocument();
  });

  test('does not show error message initially', () => {
    renderPage();
    expect(
      screen.queryByText(/Please select a file/i)
    ).not.toBeInTheDocument();
  });


  test('allows selecting a file', () => {
    renderPage();
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'aadhaar.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files[0].name).toBe('aadhaar.pdf');
  });

  test('clears error when a file is selected', async () => {
    renderPage();

    
    fireEvent.click(screen.getByRole('button', { name: /Upload & Find Schemes/i }));
    await waitFor(() => {
      expect(screen.getByText('Please select a file')).toBeInTheDocument();
    });

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.queryByText('Please select a file')).not.toBeInTheDocument();
    });
  });

  

  test('shows error when upload clicked without selecting file', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Upload & Find Schemes/i }));
    await waitFor(() => {
      expect(screen.getByText('Please select a file')).toBeInTheDocument();
    });
  });

  

  test('button is disabled while loading', async () => {
   
    global.fetch.mockImplementationOnce(() => new Promise(() => {}));

    renderPage();

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /Upload & Find Schemes/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: '' }) // loading shows spinner, not text
      ).toBeDisabled();
    });
  });

  test('shows error message when S3 upload fails', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false }); // S3 fails

    renderPage();

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /Upload & Find Schemes/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Failed to process document')
      ).toBeInTheDocument();
    });
  });

  test('shows error when API call fails after S3 upload', async () => {
   
    global.fetch
      .mockResolvedValueOnce({ ok: true }) // S3 PUT success
      .mockResolvedValueOnce({ ok: false, text: async () => 'Server Error' }); // API fails

    vi.useFakeTimers(); // skip the 5 second wait

    renderPage();

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /Upload & Find Schemes/i }));

    vi.runAllTimers();

    await waitFor(() => {
      expect(
        screen.getByText('Failed to process document')
      ).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  test('navigates to /document-schemes on full success', async () => {
    const mockSchemes = [
      {
        scheme_name: 'Ayushman Bharat Yojana',
        description: 'Health scheme',
        required_documents: ['Aadhaar', 'Income Certificate'],
      },
    ];

    global.fetch
      .mockResolvedValueOnce({ ok: true }) // S3 upload
      .mockResolvedValueOnce({             // API call
        ok: true,
        json: async () => ({
          body: JSON.stringify({ eligibleSchemes: mockSchemes }),
        }),
      });

    vi.useFakeTimers();

    renderPage();

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /Upload & Find Schemes/i }));

    vi.runAllTimers();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/document-schemes',
        expect.objectContaining({ state: expect.objectContaining({ schemes: expect.any(Array) }) })
      );
    });

    vi.useRealTimers();
  });

  test('saves schemes to localStorage on success', async () => {
    const mockSchemes = [
      {
        scheme_name: 'Jan Dhan Yojana',
        description: 'Banking scheme',
        required_documents: ['Aadhaar'],
      },
    ];

    global.fetch
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          body: JSON.stringify({ eligibleSchemes: mockSchemes }),
        }),
      });

    vi.useFakeTimers();

    renderPage();

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /Upload & Find Schemes/i }));

    vi.runAllTimers();

    await waitFor(() => {
      const stored = localStorage.getItem('documentSchemes');
      expect(stored).not.toBeNull();
    });

    vi.useRealTimers();
  });
});
