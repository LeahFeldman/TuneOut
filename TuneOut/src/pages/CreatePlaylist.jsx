import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePlaylist = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistAuthor, setPlaylistAuthor] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songDuration, setSongDuration] = useState('');
  const [songList, setSongList] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const confirmationRef = useRef(null);

  useEffect(() => {
    if (response && confirmationRef.current) {
      confirmationRef.current.focus();
    }
  }, [response]);

  // Basic form validation
  const validateSong = () => {
    const newErrors = {};
    if (!songTitle.trim()) newErrors.songTitle = 'Song title is required.';
    if (!songArtist.trim()) newErrors.songArtist = 'Song artist is required.';
    if (!songDuration.trim()) {
      newErrors.songDuration = 'Song duration is required.';
    } else if (!/^\d{1,2}:\d{2}$/.test(songDuration.trim())) {
      newErrors.songDuration = 'Duration format must be mm:ss';
    }
    return newErrors;
  };

  const validatePlaylist = () => {
    const newErrors = {};
    if (!playlistName.trim()) newErrors.playlistName = 'Playlist title is required.';
    if (!playlistAuthor.trim()) newErrors.playlistAuthor = 'Author is required.';
    if (songList.length === 0) newErrors.songList = 'Add at least one song.';
    return newErrors;
  };

  const AddSong = () => {
    const validationErrors = validateSong();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const newSong = {
      title: songTitle.trim(),
      artist: songArtist.trim(),
      duration: songDuration.trim(),
    };
    setSongList([...songList, newSong]);
    setSongTitle('');
    setSongArtist('');
    setSongDuration('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const playlistErrors = validatePlaylist();
    if (Object.keys(playlistErrors).length > 0) {
      setErrors(playlistErrors);
      setResponse(null);
      setError(null);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('https://ljuks4nc2i.execute-api.us-east-1.amazonaws.com/CreatePlaylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playlistName.trim(),
          author: playlistAuthor.trim(),
          songs: songList,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data);
        setError(null);
        // reset form
        setPlaylistName('');
        setPlaylistAuthor('');
        setSongList([]);
        setSongTitle('');
        setSongArtist('');
        setSongDuration('');
        // wait then navigate
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(data.message || 'Failed to create playlist');
        setResponse(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create Playlist</h2>

      {response && (
        <div
          ref={confirmationRef}
          tabIndex={-1}
          className="alert alert-success mt-4"
          role="alert"
          aria-live="assertive"
          style={{ outline: 'none' }}
        >
          <strong>Success:</strong> {response.message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-4" role="alert" aria-live="assertive">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="playlistTitle">
            Playlist Title <span aria-hidden="true" style={{ color: 'red' }}>*</span>
          </label>
          <input
            id="playlistTitle"
            type="text"
            className={`form-control ${errors.playlistName ? 'is-invalid' : ''}`}
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            aria-describedby={errors.playlistName ? 'playlistName-error' : undefined}
            aria-invalid={errors.playlistName ? 'true' : 'false'}
            required
          />
          {errors.playlistName && (
            <div id="playlistName-error" className="invalid-feedback">
              {errors.playlistName}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="playlistAuthor">
            Author <span aria-hidden="true" style={{ color: 'red' }}>*</span>
          </label>
          <input
            id="playlistAuthor"
            type="text"
            className={`form-control ${errors.playlistAuthor ? 'is-invalid' : ''}`}
            value={playlistAuthor}
            onChange={(e) => setPlaylistAuthor(e.target.value)}
            aria-describedby={errors.playlistAuthor ? 'playlistAuthor-error' : undefined}
            aria-invalid={errors.playlistAuthor ? 'true' : 'false'}
            required
          />
          {errors.playlistAuthor && (
            <div id="playlistAuthor-error" className="invalid-feedback">
              {errors.playlistAuthor}
            </div>
          )}
        </div>

        <fieldset className="mb-3">
          <legend>Add Song <span aria-hidden="true" style={{ color: 'red' }}>*</span></legend>
          <div className="d-flex flex-column flex-md-row gap-2">
            <input
              id="songTitle"
              type="text"
              className={`form-control ${errors.songTitle ? 'is-invalid' : ''}`}
              placeholder="Title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              aria-describedby={errors.songTitle ? 'songTitle-error' : undefined}
              aria-invalid={errors.songTitle ? 'true' : 'false'}
            />
            {errors.songTitle && (
              <div id="songTitle-error" className="invalid-feedback d-block">
                {errors.songTitle}
              </div>
            )}

            <input
              id="songArtist"
              type="text"
              className={`form-control ${errors.songArtist ? 'is-invalid' : ''}`}
              placeholder="Artist"
              value={songArtist}
              onChange={(e) => setSongArtist(e.target.value)}
              aria-describedby={errors.songArtist ? 'songArtist-error' : undefined}
              aria-invalid={errors.songArtist ? 'true' : 'false'}
            />
            {errors.songArtist && (
              <div id="songArtist-error" className="invalid-feedback d-block">
                {errors.songArtist}
              </div>
            )}

            <input
              id="songDuration"
              type="text"
              className={`form-control ${errors.songDuration ? 'is-invalid' : ''}`}
              placeholder="Duration (mm:ss)"
              value={songDuration}
              onChange={(e) => setSongDuration(e.target.value)}
              aria-describedby={errors.songDuration ? 'songDuration-error' : undefined}
              aria-invalid={errors.songDuration ? 'true' : 'false'}
              pattern="^\d{1,2}:\d{2}$"
              title="Duration format: mm:ss"
            />
            {errors.songDuration && (
              <div id="songDuration-error" className="invalid-feedback d-block">
                {errors.songDuration}
              </div>
            )}

            <button
              id="addSong"
              type="button"
              className="btn btn-outline-primary"
              onClick={AddSong}
              aria-label="Add song to playlist"
            >
              +
            </button>
          </div>
          {errors.songList && (
            <div className="text-danger mt-1" role="alert" aria-live="assertive">
              {errors.songList}
            </div>
          )}
        </fieldset>

        {songList.length > 0 && (
          <ul className="list-group mb-3" aria-live="polite" aria-relevant="additions">
            {songList.map((song, index) => (
              <li key={index} className="list-group-item">
                {song.title} by {song.artist} ({song.duration})
              </li>
            ))}
          </ul>
        )}

        <button
          id="submitPlaylist"
          type="submit"
          className="btn btn-success"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Creating...' : 'Create Playlist'}
        </button>
      </form>
    </div>
  );
};

export default CreatePlaylist;
