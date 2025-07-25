import React, { useState } from 'react';
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
  const navigate = useNavigate();


  const AddSong = () => {
    if (songTitle && songArtist && songDuration) {
      const newSong = {
        title: songTitle.trim(),
        artist: songArtist.trim(),
        duration: songDuration.trim()
      };
      setSongList([...songList, newSong]);
      setSongTitle('');
      setSongArtist('');
      setSongDuration('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://l9kvphvd0a.execute-api.us-east-1.amazonaws.com/CreatePlaylist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        name: playlistName,
        author: playlistAuthor,
        songs: songList
        })

      });

      const data = await res.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch');
      setResponse(null);
    }

    // wait until the success message shows before navigating
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTimeout(() => {
      navigate('/');
    }
    , 3000);
    // reset form fields
    setPlaylistName('');
    setPlaylistAuthor('');
    setSongList([]);
    setSongTitle('');
    setSongArtist('');
    setSongDuration('');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create Playlist</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="playlistTitle">Playlist Title</label>
          <input
            id="playlistTitle"
            type="text"
            className="form-control"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="playlistAuthor">Author</label>
          <input
            id="playlistAuthor"
            type="text"
            className="form-control"
            value={playlistAuthor}
            onChange={(e) => setPlaylistAuthor(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Add Song</label>
          <div className="d-flex flex-column flex-md-row gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Artist"
              value={songArtist}
              onChange={(e) => setSongArtist(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Duration"
              value={songDuration}
              onChange={(e) => setSongDuration(e.target.value)}
            />
            <button type="button" className="btn btn-outline-primary" onClick={AddSong}>+</button>
          </div>
        </div>

        {songList.length > 0 && (
          <ul className="list-group mb-3">
            {songList.map((song, index) => (
              <li key={index} className="list-group-item">
                {song.title} by {song.artist} ({song.duration})
              </li>
            ))}
          </ul>
        )}

        <button type="submit" className="btn btn-success">Create Playlist</button>
      </form>

      {response && (
        <div className="alert alert-success mt-4">
          <strong>Success:</strong> {response.message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-4">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default CreatePlaylist;
