import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DeletePlaylist() {
  const { id: playlistId } = useParams();
  const [playlistName, setPlaylistName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const res = await fetch(
          'https://ljuks4nc2i.execute-api.us-east-1.amazonaws.com/readPlaylist'
        );
        const data = await res.json();
        const matched = data.find((p) => String(p.pk) === playlistId);
        setPlaylistName(matched?.name || matched?.title || 'Untitled Playlist');
      } catch {
        setPlaylistName('Untitled Playlist');
      }
    }
    fetchPlaylist();
  }, [playlistId]);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://ljuks4nc2i.execute-api.us-east-1.amazonaws.com/DeletePlaylist?playlistId=${playlistId}`,
        { method: 'DELETE' }
      );
      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Playlist deleted successfully!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setMessage(`❌ Network error: ${err.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Delete Playlist: {playlistName}</h2>
      <p>Are you sure you want to delete this playlist?</p>
      <button className="btn btn-danger me-2" onClick={handleDelete}>
        Delete
      </button>
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        Cancel
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default DeletePlaylist;
