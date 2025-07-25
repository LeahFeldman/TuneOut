import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import CreatePlaylist from './CreatePlaylist';

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'Playlist created successfully!' }),
  })
);

describe('CreatePlaylist Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('adds a song to the list when all fields are filled', () => {
    render( <MemoryRouter>
          <CreatePlaylist />
         </MemoryRouter>
);

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Song A' },
    });
    fireEvent.change(screen.getByPlaceholderText('Artist'), {
      target: { value: 'Artist A' },
    });
    fireEvent.change(screen.getByPlaceholderText('Duration'), {
      target: { value: '3:30' },
    });

    fireEvent.click(screen.getByText('+'));

    expect(screen.getByText(/Song A by Artist A \(3:30\)/)).toBeInTheDocument();
  });

  test('submits the form and shows success message', async () => {
    render( <MemoryRouter>
          <CreatePlaylist />
          </MemoryRouter>
);

    fireEvent.change(screen.getByLabelText(/Playlist Title/i), {
      target: { value: 'My Playlist' },
    });
    fireEvent.change(screen.getByLabelText(/Author/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Song B' },
    });
    fireEvent.change(screen.getByPlaceholderText('Artist'), {
      target: { value: 'Artist B' },
    });
    fireEvent.change(screen.getByPlaceholderText('Duration'), {
      target: { value: '4:00' },
    });
    fireEvent.click(screen.getByText('+'));

    fireEvent.click(screen.getByRole('button', { name: /Create Playlist/i }));


    await waitFor(() =>
      expect(screen.getByText(/Playlist created successfully!/i)).toBeInTheDocument()
    );
  });
});
