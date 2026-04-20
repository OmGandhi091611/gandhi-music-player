import CoverArt from "./CoverArt";

function SkeletonRow() {
  return (
    <div className="song-row skeleton-row" aria-hidden="true">
      <div className="skeleton skeleton-index" />
      <div className="skeleton skeleton-cover" />
      <div className="song-meta-mobile">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-artist" />
      </div>
    </div>
  );
}

function SongList({ songs, currentSongId, isPlaying, onSongSelect, loading }) {
  if (loading) {
    return (
      <div className="song-list-scroll">
        <div className="song-list">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!songs.length) {
    return (
      <div className="empty-state">
        <p>No songs found for that search.</p>
      </div>
    );
  }

  return (
    <div className="song-list-scroll">
      <div className="song-list">
        {songs.map((song, index) => {
          const active = song.id === currentSongId;

          return (
            <button
              key={song.id}
              type="button"
              className={`song-row song-row-mobile-fit ${active ? "active" : ""}`}
              onClick={() => onSongSelect(song.id)}
            >
              <span className="song-index-mobile">
                {active && isPlaying ? "♪" : String(index + 1).padStart(2, "0")}
              </span>

              <CoverArt
                cover={song.cover}
                title={song.title}
                className="song-cover-mobile"
                iconClassName="song-fallback-icon-mobile"
              />

              <div className="song-meta-mobile">
                <span className="song-title-mobile" title={song.title}>
                  {song.title}
                </span>
                <span className="song-artist-mobile" title={song.artist || "Unknown Artist"}>
                  {song.artist || "Unknown Artist"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SongList;
