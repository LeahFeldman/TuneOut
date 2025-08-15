import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ReadPlaylist() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const res = await fetch('https://ljuks4nc2i.execute-api.us-east-1.amazonaws.com/readPlaylist');
        if (!res.ok) throw new Error('Network response was not OK');

        const data = await res.json();
        const selected = data.find((p) => String(p.pk) === id);

        if (!selected) {
          throw new Error('Playlist not found.');
        }

        setPlaylist(selected);
      } catch (err) {
        console.error('Error fetching playlist:', err);
        setError('Something went wrong fetching the playlist.');
      }
    }

    fetchPlaylist();
  }, [id]);

  return (
    <main
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: 'calc(100vh - 100px)',
        background: 'linear-gradient(135deg, #f8f9fa, #e0e7ff)',
        overflow: 'hidden',
        padding: '1rem',
      }}
    >
      <div
        className="card shadow-sm rounded-4 border-0 w-100"
        style={{ maxWidth: '540px', padding: '1.5rem' }}
      >
        {error && (
          <div className="alert alert-danger text-center py-2" role="alert" tabIndex={-1}>
            {error}
          </div>
        )}

        {!playlist ? (
          <div
            className="text-center text-muted"
            aria-live="polite"
            aria-busy="true"
          >
            Loading playlist...
          </div>
        ) : (
          <>
            {/* Use h1 for main playlist title */}
            <h1 className="fw-bold text-dark text-center mb-1">
              {playlist.name || playlist.title || 'Untitled Playlist'}
            </h1>
            <p className="text-center text-muted mb-4 small">
              by <strong>{playlist.author || 'Unknown'}</strong>
            </p>

            {/* Use h2 for Songs section */}
            <h2 className="text-uppercase text-secondary fw-semibold small mb-2" id="songs-heading">
              Songs
            </h2>

            {Array.isArray(playlist.songs) && playlist.songs.length > 0 ? (
              <ul
                className="list-group list-group-flush small"
                aria-labelledby="songs-heading"
              >
                {playlist.songs.map((song, i) => (
                  <li
                    key={i}
                    className="list-group-item px-0 d-flex justify-content-between align-items-center"
                  >
                    <div className="w-100">
                      <div
                        className="text-start fw-semibold"
                        id={`song-title-${i}`}
                      >
                        {song.title}
                      </div>
                      <div
                        className="text-start text-muted small"
                        id={`song-artist-${i}`}
                      >
                        {song.artist}
                      </div>
                    </div>
                    <span className="text-secondary ms-3" aria-label={`Duration: ${song.duration}`}>
                      {song.duration}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted fst-italic">No songs listed for this playlist.</p>
            )}

            <div className="d-flex flex-column align-items-center gap-2 mb-4 mt-3">
              <button
                onClick={() => navigate(`/AddSong/${playlist.pk}`)}
                className="btn btn-outline-secondary btn-sm w-75"
                aria-label={`Add song to playlist ${playlist.name || playlist.title}`}
              >
                ➕ Add Song
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default ReadPlaylist;
