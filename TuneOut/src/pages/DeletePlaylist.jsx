import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DeletePlaylist() {
  const { id: playlistId } = useParams(); // expects /delete/:id in your route
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://ljuks4nc2i.execute-api.us-east-1.amazonaws.com/DeletePlaylist?playlistId=${playlistId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Playlist deleted successfully!');
        setTimeout(() => navigate('/'), 1500); // Redirect after 1.5s
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setMessage(`❌ Network error: ${err.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Delete Playlist {playlistId}</h2>
      <p>Are you sure you want to delete this playlist?</p>
      <button className="btn btn-danger me-2" onClick={handleDelete}>Delete</button>
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default DeletePlaylist;
