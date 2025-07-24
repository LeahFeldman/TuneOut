import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function AddSong() {
  const { id } = useParams(); // playlist ID from URL

  const [playlistName, setPlaylistName] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');

  // 🌟 Fetch playlist name using ID
  useEffect(() => {
    async function fetchName() {
      try {
        const res = await fetch('https://l9kvphvd0a.execute-api.us-east-1.amazonaws.com/readPlaylist');
        const data = await res.json();
        const matched = data.find((p) => String(p.pk) === id);
        setPlaylistName(matched?.name || matched?.title || 'Untitled Playlist');
      } catch (err) {
        setPlaylistName('Untitled Playlist');
      }
    }
    fetchName();
  }, [id]);

  // 🚀 Handle song submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      playlistId: id,
      title,
      artist,
      duration,
    };

    try {
      const response = await fetch(
        'https://l9kvphvd0a.execute-api.us-east-1.amazonaws.com/UpdatePlaylist',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Song added successfully!');
        setTitle('');
        setArtist('');
        setDuration('');
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setMessage(`❌ Network error: ${err.message}`);
    }
  };

  return (
    <div
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
        style={{
          maxWidth: '540px',
          padding: '1.5rem',
        }}
      >
        <h4 className="fw-bold text-dark text-center mb-1">
          {playlistName}
        </h4>
        <p className="text-center text-muted mb-4 small">
          Add a new song to your playlist
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Song Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label htmlFor="title">Title</label>
          </div>

          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="artist"
              placeholder="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />
            <label htmlFor="artist">Artist</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="duration"
              placeholder="Duration (e.g. 3:45)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
            <label htmlFor="duration">Duration</label>
          </div>

          <button type="submit" className="btn btn-outline-secondary btn-sm w-75 d-block mx-auto">
            🎵 Add Song
          </button>
        </form>

        {message && (
          <div
            className={`alert mt-3 py-2 text-center ${
              message.startsWith('✅') ? 'alert-success' : 'alert-danger'
            }`}
            role="alert"
            style={{ fontSize: '0.85rem' }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddSong;