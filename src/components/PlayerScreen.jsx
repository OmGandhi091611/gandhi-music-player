import CoverArt from "./CoverArt";

function PlayerScreen({
  song,
  isPlaying,
  currentTime,
  durationSeconds,
  onBack,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  formatTime,
  volume,
  setVolume,
}) {
  return (
    <main className="player-screen">
      <section className="player-screen-card glass">
        <div className="player-screen-top">
          <button type="button" className="back-btn" onClick={onBack}>
            ← Back
          </button>
        </div>

        <div className="player-screen-main">
          <div className="player-screen-cover-wrap">
            <CoverArt
              cover={song.cover}
              title={song.title}
              className="player-screen-cover"
              iconClassName="player-screen-fallback-icon"
            />
          </div>

          <div className="player-screen-meta">
            <h2>{song.title}</h2>
            <p>{song.artist}</p>
            <span>{song.album || "Single"}</span>
          </div>

          <div className="player-screen-progress">
            <input
              type="range"
              min="0"
              max={durationSeconds || 0}
              step="0.1"
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="progress-slider"
            />

            <div className="player-screen-times">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(durationSeconds)}</span>
            </div>
          </div>

          <div className="player-screen-controls">
            <button type="button" className="circle-btn" onClick={onPrev}>
              ⏮
            </button>
            <button
              type="button"
              className="circle-btn main-play-btn"
              onClick={onPlayPause}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button type="button" className="circle-btn" onClick={onNext}>
              ⏭
            </button>
          </div>

          <div className="player-screen-volume">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default PlayerScreen;