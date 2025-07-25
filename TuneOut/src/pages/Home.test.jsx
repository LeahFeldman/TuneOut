//mock data for testing
  const mockData = Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          pk: '1752448524051-14',
          name: 'Oldies',
          author: 'Leah Feldman',
          songs: [
            { title: '"Pray and Sing"', duration: '2:30', artist: 'MBD' },
            { title: '"Aderaba"', duration: '3:42', artist: 'Avraham Fried' }
          ]
        },
        {
          pk: 'Fast Songs',
          name: 'Fast Songs',
          author: 'TuneOut',
          songs: [
            { title: 'Hinei Ma Tov', duration: '3:30', artist: 'Mordechai Ben David' }
          ]
        }
      ])
  });

global.fetch = vi.fn(() => mockData);


import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';

describe('Home component', () => {

//render title and create button
  it('renders title and Create Playlist button', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(await screen.findByRole('heading', { name: /tuneout/i })).toBeInTheDocument();
    expect(screen.getByText('+ Create Playlist')).toBeInTheDocument();
  });


//display playlists
it('displays playlists from API', async () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(await screen.findByText('Oldies')).toBeInTheDocument();
  expect(screen.getByText('Fast Songs')).toBeInTheDocument();
});

});
