import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);

  async function handleSubscribeEmail(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");

    const payload = {email};

    try {
      const res = await fetch("https://ljuks4nc2i.execute-api.us-east-1.amazonaws.com/subscribe", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Thanks for subscribing!");
      } else {
        alert("Subscription failed. Try again later.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Something went wrong.");
    }
  }


  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const response = await fetch('https://ljuks4nc2i.execute-api.us-east-1.amazonaws.com/readPlaylist');
        const playlistNames = await response.json();
        setPlaylists(playlistNames);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    }

    fetchPlaylists();
  }, []);

  return (
    <div className="container py-5">
      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="fw-bold" style={{ fontSize: '2.5rem', letterSpacing: '0.5px' }}>
          TuneOut
        </h1>
        <p className="text-muted fs-5">TuneOut the silence, share the sound</p>
      </div>

      {/* Create Playlist Button */}
      <div className="text-center mb-5">
        <button
          onClick={() => navigate('/CreatePlaylist')}
          className="btn btn-lg btn-success px-4"
        >
          + Create Playlist
        </button>
      </div>

      {/* Playlist Grid */}
      <div className="row justify-content-center">
        {playlists.length === 0 ? (
          <p className="text-muted text-center">No playlists available. Create one to get started!</p>
        ) : (
          playlists.map((playlist) => (
            <div key={playlist.pk} id={playlist.name} className="col-6 col-md-4 col-lg-3 mb-4 d-flex">
              <div
                className="card w-100 text-center shadow-sm"
                style={{
                  aspectRatio: '1 / 1',
                  fontSize: '0.95rem',
                  padding: '0.5rem',
                }}
              >
                <div className="card-body d-flex flex-column justify-content-between p-2">
                  {/* Title + Author */}
                  <div className="mb-4 mt-3">
                    <h5 className="card-title text-center mb-1">{playlist.name}</h5>
                    <p className="text-muted small text-center mb-0">By {playlist.author || "Unknown"}</p>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex flex-column align-items-center gap-2 mb-4">
                    <button
                      onClick={() => navigate(`/ReadPlaylist/${playlist.pk}`)}
                      className="btn btn-outline-primary btn-sm w-75"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => navigate(`/AddSong/${playlist.pk}`)}
                      className="btn btn-outline-secondary btn-sm w-75"
                    >
                      Add Song
                    </button>
                    <button
                      onClick={() => navigate(`/DeletePlaylist/${playlist.pk}`)}
                      className="btn btn-outline-danger btn-sm w-75"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))
        )}
      </div>

        {/* Subscribe Form */}
    <div className="text-center mt-3">
      <form onSubmit={handleSubscribeEmail} className="d-inline-block">
        <label htmlFor="email" className="form-label mb-2">
          📬 Subscribe for Weekly Updates
        </label>
        <div className="input-group w-75 mx-auto">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="you@example.com"
            className="form-control"
            required
          />
          <button type="submit" className="btn btn-primary">
            Subscribe
          </button>
        </div>
      </form>
    </div>
  
    </div>
  );
}

export default Home;
